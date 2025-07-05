const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

const ApiError = require("../../exceptions/api-error");
const {
  Texekanq,
  sphereSequelize,
  User,
  Texekanqtype,
} = require("../../config/sphereDatabase");
const {
  getTexekanqUid,
  getTexekanqTitle,
  encodeUrl,
  generateQRCode,
  generatePdf,
  createPDF,
  formatDate,
  getShortName,
  mapDocTextFromPassports,
} = require("./helpers");
const { texekanqUidPrefix, permissionTexekanqMap } = require("./constants");
const { permissionsMap } = require("../../utils/constants");

const getFileBase64DB = async (fileName) => {
  const texekanq = await Texekanq.findOne({
    attributes: ["file_name"],
    where: { file_name: fileName },
  });

  if (!texekanq) return { attachment: null };

  const pdfName = texekanq?.dataValues?.file_name;
  const pdfPath = path.join(__dirname, "../../pdf/reports", pdfName);

  const pdfData = fs.readFileSync(pdfPath);
  const attachment = pdfData.toString("base64");

  return {
    attachment,
  };
};

const getTexekanqTypesDB = async (req) => {
  const types = await Texekanqtype.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  return types;
};

const getTexekanqsDB = async (req) => {
  const { search, types, page = "1", pageSize = "10" } = req.query;

  const currentPage = parseInt(page, 10);
  const perPage = parseInt(pageSize, 10);
  const offset = (currentPage - 1) * perPage;

  const user = req.user;
  let whereCondition = {};

  if (search && search.trim() !== "") {
    const trimmedSearch = search.trim();
    const words = trimmedSearch.split(/\s+/);

    // If exactly two words are provided, create specific conditions for first and last names
    if (words.length === 2) {
      const [word1, word2] = words;
      const firstLastCondition = {
        [Op.and]: [
          { person_fname: { [Op.like]: `%${word1}%` } },
          { person_lname: { [Op.like]: `%${word2}%` } },
        ],
      };
      const lastFirstCondition = {
        [Op.and]: [
          { person_fname: { [Op.like]: `%${word2}%` } },
          { person_lname: { [Op.like]: `%${word1}%` } },
        ],
      };

      // You can still include other fields if needed (for example, document_number, mul_number, etc.)
      whereCondition[Op.or] = [
        { document_number: { [Op.like]: `%${trimmedSearch}%` } },
        { mul_number: { [Op.like]: `%${trimmedSearch}%` } },
        { person_mname: { [Op.like]: `%${trimmedSearch}%` } },
        { pnum: { [Op.like]: `%${trimmedSearch}%` } },
        firstLastCondition,
        lastFirstCondition,
      ];
    } else {
      // For any other case (one word or more than two words), search across all fields normally
      const searchTerm = `%${trimmedSearch}%`;
      whereCondition[Op.or] = [
        { document_number: { [Op.like]: searchTerm } },
        { mul_number: { [Op.like]: searchTerm } },
        { person_fname: { [Op.like]: searchTerm } },
        { person_lname: { [Op.like]: searchTerm } },
        { person_mname: { [Op.like]: searchTerm } },
        { pnum: { [Op.like]: searchTerm } },
      ];
    }
  }

  // if (types && types.trim() !== "") {
  //   const typeIds = types.split(",").map((id) => parseInt(id, 10));
  //   whereCondition.TexekanqtypeId = { [Op.in]: typeIds };
  // }
  if (types && types.trim() !== "") {
    const typeIdsFromQuery = types.split(",").map((id) => parseInt(id, 10));
    // If there is already a condition on TexekanqtypeId, we merge the conditions by taking the intersection.
    if (whereCondition.TexekanqtypeId && whereCondition.TexekanqtypeId[Op.in]) {
      const existingTypeIds = whereCondition.TexekanqtypeId[Op.in];
      const intersection = existingTypeIds.filter((id) =>
        typeIdsFromQuery.includes(id)
      );
      whereCondition.TexekanqtypeId = { [Op.in]: intersection };
    } else {
      whereCondition.TexekanqtypeId = { [Op.in]: typeIdsFromQuery };
    }
  }

  if (user.Role !== "Admin") {
    const userReportPermissions = [
      permissionsMap.CITIZENSHIP_REPORT.uid,
      permissionsMap.PASSPORTS_REPORT.uid,
      permissionsMap.PNUM_REPORT.uid,
    ].filter((permission) => user.permissions.includes(permission));

    const permittedTypeIds = userReportPermissions.map(
      (permissionId) => permissionTexekanqMap[permissionId]
    );

    // If there is already a TexekanqtypeId condition, intersect it with the permitted IDs.
    if (whereCondition.TexekanqtypeId && whereCondition.TexekanqtypeId[Op.in]) {
      const existingTypeIds = whereCondition.TexekanqtypeId[Op.in];
      const intersection = existingTypeIds.filter((id) =>
        permittedTypeIds.includes(id)
      );
      whereCondition.TexekanqtypeId = { [Op.in]: intersection };
    } else {
      whereCondition.TexekanqtypeId = { [Op.in]: permittedTypeIds };
    }
  }

  const { count, rows } = await Texekanq.findAndCountAll({
    attributes: { exclude: ["userId", "TexekanqtypeId"] },
    include: [
      {
        model: User,
        attributes: ["firstName", "lastName"],
      },
      {
        model: Texekanqtype,
        attributes: ["name", "id"],
      },
    ],
    where: whereCondition,
    order: [["id", "DESC"]],
    offset,
    limit: perPage,
  });

  return {
    texekanqs: rows,
    pagination: {
      total: count,
      page: currentPage,
      pageSize: perPage,
      totalPages: Math.ceil(count / perPage),
    },
  };
};

const createTexekanqDb = async (req) => {
  const { user, body } = req;
  const { id: userId, pashton, firstName, lastName } = user;
  const {
    pnum,
    person_birth,
    person_birth_place,
    person_fname,
    person_lname,
    person_mname,
    person_fname_en,
    person_lname_en,
    document,
    TexekanqtypeId,
    mul_number,
    validDocuments,
    invalidDocuments,
    passports,
  } = body;

  if (TexekanqtypeId === 1) {
    const texekanqRow = await Texekanq.findOne({
      where: { mul_number, userId },
    });

    if (texekanqRow) {
      throw ApiError.BadRequest(
        "Տվյալ մալբերի համարով տեղեկանք արդեն գրանցված է"
      );
    }
  }

  const uid = getTexekanqUid(texekanqUidPrefix);
  const currentYear = new Date().getFullYear();

  const result = await sphereSequelize.transaction(async (transaction) => {
    // Find the latest texekanq for the current year
    const lastTexekanq = await Texekanq.findOne({
      where: {
        createdAt: {
          [Op.gte]: new Date(`${currentYear}-01-01`), // Start of the current year
          [Op.lt]: new Date(`${currentYear + 1}-01-01`), // Start of the next year
        },
      },
      order: [["createdAt", "DESC"]],
      lock: transaction.LOCK.UPDATE, // Prevent concurrent reads
      transaction, // Ensure the query is part of the transaction
    });

    // Calculate the new document number
    const document_number = getTexekanqTitle({
      lastTexekanq,
      currentYear,
      TexekanqtypeId,
    });
    // Create the new texekanq

    const newTexekanq = await Texekanq.create(
      {
        uid,
        userId,
        document_number,
        pnum,
        person_birth,
        person_birth_place,
        person_fname,
        person_lname,
        person_mname,
        TexekanqtypeId,
        mul_number,
      },
      { transaction } // Ensure the creation is part of the transaction
    );
    const qrData = encodeUrl(newTexekanq.dataValues.uid);
    const qrUrl = await generateQRCode(qrData);

    const person_full_name = person_mname
      ? (person_fname + " " + person_mname + " " + person_lname).toUpperCase()
      : (person_fname + " " + person_lname).toUpperCase();

    const documentText = mapDocTextFromPassports(passports);
    const person_short_name = getShortName(
      person_fname,
      person_lname,
      person_mname
    );
    const formatBirthDate = (date) => {
      const [year, month, day] = date.split("-");
      return day && month ? `${day}/${month}/${year}` : date;
    };
    const fileName = await createPDF({
      data: {
        ...newTexekanq.dataValues,
        qrUrl,
        person_full_name,
        position: pashton,
        full_name: firstName + " " + lastName,
        person_fname_en,
        person_lname_en,
        person_birth: formatBirthDate(newTexekanq.dataValues.person_birth),
        document,
        validDocuments,
        invalidDocuments,
        documentText,
        person_short_name,
        createdAt: formatDate(newTexekanq.dataValues.createdAt),
        passports,
      },
      TexekanqtypeId,
    });

    await newTexekanq.update(
      { file_name: fileName },
      { transaction } // Ensure the update is part of the transaction
    );
    return newTexekanq;
  });

  const pdfPath = path.join(
    __dirname,
    "../../pdf/reports",
    result.dataValues.file_name
  );

  const pdfData = fs.readFileSync(pdfPath);
  const attachment = pdfData.toString("base64");

  return attachment;
};

module.exports = {
  createTexekanqDb,
  getTexekanqsDB,
  getFileBase64DB,
  getTexekanqTypesDB,
};
