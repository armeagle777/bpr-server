const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { log } = require("console");
const { Op } = require("sequelize");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const { PDFDocument } = require("pdf-lib");

const { activityCodes } = require("./spheres");
const { Sphere } = require("../config/sphereDatabase");
const { bulkUpsert } = require("../modules/sphere/services");
const { getCompanyByHvhhDb } = require("../modules/persons/services");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// const ApiError = require('../exceptions/api-error');
const sendActivationMail = async (to, link) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: "Best Application",
      to,
      subject: "Activate your account",
      text: "",
      html: `
                <div>
                    <h1>Activate your account</h1>
                    <p>Please click on the link below to activate your account</p>
                    <a href="${process.env.API_URL}/api/users/active/${link}">${process.env.API_URL}/api/users/active/${link}</a>
                </div>
                `,
    });
  } catch (err) {
    console.log(err);
  }
};

const generateTokens = async (payload) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};

const createUserData = (userObject) => {
  return {
    id: userObject.id,
    email: userObject.email,
    pashton: userObject.pashton,
    firstName: userObject.firstName,
    lastName: userObject.lastName,
    isActivated: userObject.isActivated,
    Role: userObject.Role.name,
    permissions: userObject.Role.Permissions.map((p) => p.uid),
  };
};

const validateRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};

const validateAccessToken = (accessToken) => {
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

// const validateSchema = (schema) => {
//     if (typeof schema !== 'object' || schema === null)
//         throw new Error(JOI_VALIDATION_MESSAGES.SCHEMA_OBJECT);

//     return async (req, res, next) => {
//         const { params, body } = req;

//         try {
//             schema.params && (await schema.params.validateAsync(params));
//             schema.body && (await schema.body.validateAsync(body));
//             return next();
//         } catch (error) {
//             next(ApiError.BadRequest(error.message));
//         }
//     };
// };

const createPDF = async ({ data, statisticsType, period }) => {
  const templatePeriodMap = {
    h1: "first_half",
    h2: "second_half",
    annual: "annual",
  };
  const templateName =
    statisticsType === "asylum"
      ? `${statisticsType}_${templatePeriodMap[period]}`
      : statisticsType;

  const titulName =
    statisticsType === "asylum"
      ? `${statisticsType}_${templatePeriodMap[period]}_titul`
      : `${statisticsType}_titul`;

  const generatedPath = path.join(
    process.cwd(),
    `src/pdf-templates/${templateName}.html`
  );
  const titulGeneratedPath = path.join(
    process.cwd(),
    `src/pdf-templates/${titulName}.html`
  );

  // Register the 'sum' and 'eq' helpers
  handlebars.registerHelper("sum", function (a, b) {
    return a + b;
  });
  handlebars.registerHelper("sumAll", function () {
    let sum = 0;
    for (let i = 0; i < arguments.length - 1; i++) {
      sum += arguments[i];
    }
    return sum;
  });
  handlebars.registerHelper("eq", function (a, b) {
    return a === b;
  });
  handlebars.registerHelper("incrementIndex", function (index) {
    return index + 1;
  });
  handlebars.registerHelper("getCountryData", function (data, countryName) {
    return data[countryName] || 0;
  });

  var milis = new Date();
  milis = milis.getTime();

  var titulPath = path.join("src", "pdf", `titul.pdf`);
  var contentPath = path.join("src", "pdf", `content.pdf`);
  var responseFilePath = path.join("src", "pdf", `${milis}.pdf`);

  const optionsPortrait = {
    width: "210mm",
    height: "297mm",
    headerTemplate: "<p></p>",
    footerTemplate: "<p></p>",
    displayHeaderFooter: false,
    printBackground: true,
    path: titulPath,
  };

  const optionsLandscape = {
    width: "297mm",
    height: "210mm",
    headerTemplate: "<p></p>",
    footerTemplate: "<p></p>",
    displayHeaderFooter: false,
    printBackground: true,
    path: contentPath,
  };

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: "new",
  });

  const titulTemplateHtml = fs.readFileSync(titulGeneratedPath, "utf8");
  var titulTemplate = handlebars.compile(titulTemplateHtml);
  var firstPageHtml = titulTemplate(data);

  var contentTemplateHtml = fs.readFileSync(generatedPath, "utf8");
  var contentTemplate = handlebars.compile(contentTemplateHtml);
  var contentPageHtml = contentTemplate(data);

  var page = await browser.newPage();

  await page.setContent(firstPageHtml, {
    waitUntil: "networkidle0",
  });
  await page.pdf(optionsPortrait);

  await page.setContent(contentPageHtml, {
    waitUntil: "networkidle0",
  });
  await page.pdf(optionsLandscape);

  // await page.pdf(options);
  await browser.close();

  // Combine the PDFs
  const firstPagePdfBytes = fs.readFileSync(titulPath);
  const remainingPagesPdfBytes = fs.readFileSync(contentPath);

  const firstPagePdf = await PDFDocument.load(firstPagePdfBytes);
  const remainingPagesPdf = await PDFDocument.load(remainingPagesPdfBytes);

  const combinedPdf = await PDFDocument.create();
  const [firstPage] = await combinedPdf.copyPages(firstPagePdf, [0]);
  combinedPdf.addPage(firstPage);

  const remainingPages = await combinedPdf.copyPages(
    remainingPagesPdf,
    remainingPagesPdf.getPageIndices()
  );
  for (const page of remainingPages) {
    combinedPdf.addPage(page);
  }

  const combinedPdfBytes = await combinedPdf.save();
  fs.writeFileSync(responseFilePath, combinedPdfBytes);

  // Clean up temporary files
  fs.unlinkSync(titulPath);
  fs.unlinkSync(contentPath);

  return responseFilePath;
};

const isPetregisterDataAvailable = (data) => {
  const isDataAvailable =
    process.env.NODE_ENV === "local" ? data.length !== 0 : !!data.result;

  return isDataAvailable;
};

const getCompanyFromApi = async (hvhh) => {
  const taxUrl = process.env.PETREGISTR_URL;

  const { data } =
    process.env.NODE_ENV === "local"
      ? await axios.get(`${taxUrl}?fake_tax_id=${hvhh}`)
      : await axios.post(taxUrl, {
          jsonrpc: "2.0",
          id: 1,
          method: "company_info",
          params: { tax_id: hvhh },
        });

  if (!isPetregisterDataAvailable(data)) {
    return { company: { taxid: hvhh } };
  }

  const { result } = process.env.NODE_ENV === "local" ? data[0] : data;

  return result;
};

const cronUpdateSphereText = async () => {
  try {
    const unCheckedSpheres = await Sphere.findAll({
      attributes: ["tin", "sphere_code"],
      where: {
        [Op.and]: [
          { sphere_text: null },
          {
            sphere_code: {
              [Op.not]: null,
            },
          },
        ],
      },
    });

    if (unCheckedSpheres.length === 0) return;

    const companiesTins = unCheckedSpheres.map(({ tin, sphere_code }) => {
      const shortSphereCode = sphere_code.substring(0, sphere_code.length - 2);

      const sphereName = activityCodes[sphere_code]
        ? activityCodes[sphere_code]
        : sphere_code.slice(-2) === ".0" && activityCodes[shortSphereCode]
        ? activityCodes[shortSphereCode]
        : null;

      return {
        tin: tin,
        sphere_text: sphereName,
      };
    });

    await bulkUpsert(Sphere, companiesTins, "tin");
  } catch (error) {
    console.log("Crone Error", error);
  }
};

const cronUpdateSphere = async () => {
  try {
    const unCheckedSpheres = await Sphere.findAll({
      attributes: ["tin"],
      where: {
        is_checked: 0,
      },
    });

    if (unCheckedSpheres.length === 0) return;

    const promises = unCheckedSpheres.map(({ tin }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const { company } = await getCompanyFromApi(tin);

          resolve(company);
        } catch (error) {
          reject(error);
        }
      });
    });

    const companyObjectArray = await Promise.allSettled(promises);

    const companiesTins = companyObjectArray
      .filter((obj) => obj.status === "fulfilled")
      .map((company) => ({
        tin: company.value.taxid,
        name: company.value.name_am,
        sphere_code: company.value.industry_code,
        is_inactive: company.value.inactive,
        is_blocked: company.value.is_blocked,
        is_checked: true,
      }));

    if (companiesTins.length === 0) return;

    await bulkUpsert(Sphere, companiesTins, "tin");
  } catch (error) {
    console.log("error::::::", error);
  }
};

function getCurrentDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

module.exports = {
  createPDF,
  createUserData,
  generateTokens,
  getCurrentDate,
  cronUpdateSphere,
  sendActivationMail,
  cronUpdateSphereText,
  validateRefreshToken,
  validateAccessToken,
};
