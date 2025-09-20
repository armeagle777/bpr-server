const excel = require("exceljs");
const { filterLogsAllDataDB } = require("../log/services");

const generateExcelFileDB = async (filters) => {
  const data = await getLogsExcelDataDB(filters);

  const { headerRows, mergeCellRanges } = formatExcelMetaData();

  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");
  worksheet.getColumn(1).width = 20;

  worksheet.addRow(headerRows);
  if (mergeCellRanges) mergeAndAlignCells(worksheet, mergeCellRanges);
  data.forEach((item, index) => {
    worksheet.addRow(Object.values(item));
  });

  return workbook;
};

async function getLogsExcelDataDB(filters) {
  const data = await filterLogsAllDataDB(filters);
  const plainRows = data.map((r) => r.get({ plain: true }));
  const sanitizeData = plainRows.map(({ User, createdAt, LogType, fields }) => {
    return [
      `${User.firstName} ${User.lastName}`,
      User.email,
      createdAt,
      LogType.name,
      fields,
    ];
  });
  return sanitizeData;
}

function formatExcelMetaData() {
  const headerRows = ["ԱԱՀ", "էլ. փոստ", "Ա/թ", "Տիպը", "Տվյալները"];

  // const mergeCellRanges = ["B1:D1", "E1:G1", "H1:J1", "A1:A2"];

  return {
    headerRows,
    // mergeCellRanges,
  };
}

function mergeAndAlignCells(workSheet, mergedCellsRange) {
  if (!mergedCellsRange) return;
  mergedCellsRange.forEach((range) => {
    workSheet.mergeCells(range);
    const cell = workSheet.getCell(range.split(":")[0]);
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });
}

module.exports = { getLogsExcelDataDB, generateExcelFileDB };
