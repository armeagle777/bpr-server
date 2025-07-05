const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const { PDFDocument } = require("pdf-lib");

const jwt = require("jsonwebtoken");
// const ApiError = require('../exceptions/api-error');

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
  validateRefreshToken,
  validateAccessToken,
};
