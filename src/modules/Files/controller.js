const { generateExcelFileDB } = require("./services");

const exportExcel = async (req, res, next) => {
  try {
    const { filters } = req.body;
    const excelFile = await generateExcelFileDB(filters);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=exported_data.xlsx"
    );

    await excelFile.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports = { exportExcel };
