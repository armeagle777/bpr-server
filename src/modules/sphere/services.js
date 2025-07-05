const fs = require("fs");
const XLSX = require("xlsx");
const v4 = require("uuid").v4;
const { Sphere } = require("../../config/sphereDatabase");
const { sphereSequelize } = require("../../config/sphereDatabase");
const { Sequelize, DataTypes } = require("sequelize");

const insertDataFromFile = async (files) => {
  const excelDocument = files.filepond;
  const filePath = "./src/public/" + v4() + "_" + excelDocument.name;
  await excelDocument.mv(filePath);

  const workBook = XLSX.readFile(filePath);
  const workSheet = workBook.Sheets[workBook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_row_object_array(workSheet);

  const filteredData = data.map((row) => {
    const { tin } = row;

    if (tin && tin.length === 8) {
      return {
        tin,
        is_checked: false,
      };
    }
  });

  await bulkUpsert(Sphere, filteredData, "tin");
  fs.rmSync(filePath, {
    force: true,
  });
  return {
    status: true,
    message: "File is uploaded",
    data: {
      name: excelDocument.name,
      mimetype: excelDocument.mimetype,
      size: excelDocument.size,
    },
  };
};

const getSpheresDataDb = async () => {
  const data = await Sphere.findAll({
    order: [
      // Will escape title and validate DESC against a list of valid direction parameters
      ["id", "DESC"],
    ],
  });

  return data;
};

// Function to perform bulk upsert
async function bulkUpsert(model, data, uniqueKey) {
  const updateValues = Object.keys(data[0])
    .filter((key) => key !== uniqueKey)
    .map((key) => `${key} = VALUES(${key})`)
    .join(", ");

  const query = `
      INSERT INTO ${model.getTableName()} (${Object.keys(data[0]).join(", ")})
      VALUES ${data.map(() => "(?)").join(", ")}
      ON DUPLICATE KEY UPDATE ${updateValues}
    `;

  await sphereSequelize.query(query, {
    replacements: data.map((item) => Object.values(item)),
    type: Sequelize.QueryTypes.INSERT,
  });
}

module.exports = {
  insertDataFromFile,
  getSpheresDataDb,
  bulkUpsert,
};
