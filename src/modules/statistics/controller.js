const excel = require("exceljs");
const { STATISTICS_TYPE_MAPS } = require("./constants");
const {
  mergeAndAlignCells,
  formatExcelMetaData,
  sanitizeData,
} = require("./helpers");
const { createPdfService, getStatisticsPeriodsDataDb } = require("./services");

const {
  getAsylumTotalDb,
  getAsylumApplicationsDb,
  getAsylumDecisionsDb,
  getAsylumYearsDb,
  insertDataFromFile,
  getBorderCrossTotalDb,
  getBorderCrossCountriesDb,
  getBorderCrossPeriodsDb,
  getSimpleWPStatisticsDb,
} =
  process.env.NODE_ENV === "local"
    ? require("./services-local")
    : require("./services");

const exportPdf = async (req, res, next) => {
  try {
    const createdFile = await createPdfService(req);
    res.download(createdFile);
  } catch (error) {
    next(error);
  }
};

const exportExcel = async (req, res, next) => {
  try {
    const { filters } = req.body;
    const { statisticsType, ...filterOptions } = filters;
    let data;
    switch (statisticsType) {
      case STATISTICS_TYPE_MAPS.B_CROSS_TOTAL:
        data = await getBorderCrossTotalDb(filterOptions);
        break;
      case STATISTICS_TYPE_MAPS.B_CROSS_COUNTRIES:
        data = await getBorderCrossCountriesDb(filterOptions);
        break;
      case STATISTICS_TYPE_MAPS.B_CROSS_PERIOD:
        data = await getBorderCrossPeriodsDb(filterOptions);
        break;
      case STATISTICS_TYPE_MAPS.ASYLUM_TOTAL:
        data = await getAsylumTotalDb(filterOptions);
        break;
      case STATISTICS_TYPE_MAPS.ASYLUM_APPLICATIONS:
        data = await getAsylumApplicationsDb(filterOptions);
        break;
      case STATISTICS_TYPE_MAPS.ASYLUM_DECISIONS:
        data = await getAsylumDecisionsDb(filterOptions);
        break;
      case STATISTICS_TYPE_MAPS.ASYLUM_YEARS:
        data = await getAsylumYearsDb(filterOptions);
        break;
      case STATISTICS_TYPE_MAPS.WP_SIMPLE:
        data = await getSimpleWPStatisticsDb(filterOptions);
        break;
      default:
        data = [];
    }

    const sanitizedData = sanitizeData(data);

    const { headerRows, subHeaderRows, mergeCellRanges } =
      formatExcelMetaData(statisticsType);

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");
    worksheet.getColumn(1).width = 20;

    worksheet.addRow(headerRows);
    subHeaderRows && worksheet.addRow(subHeaderRows);
    mergeAndAlignCells(worksheet, mergeCellRanges);
    sanitizedData.forEach((item, index) => {
      worksheet.addRow(Object.values(item));
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=exported_data.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};

const getAsylumTotal = async (req, res, next) => {
  try {
    const { year, period, month } = req.body;
    const data = await getAsylumTotalDb({ year, period, month });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const getAsylumApplications = async (req, res, next) => {
  try {
    const { year, period, month } = req.body;
    const data = await getAsylumApplicationsDb({ year, period, month });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const getAsylumDecisions = async (req, res, next) => {
  try {
    const { year, period, decType, month } = req.body;
    const data = await getAsylumDecisionsDb({ year, period, decType, month });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const getAsylumYears = async (req, res, next) => {
  try {
    const data = await getAsylumYearsDb();

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const uploadBorderCrossFile = async (req, res, next) => {
  try {
    const { files } = req;

    if (!files) {
      res.status(400).send({
        message: "No file uploaded",
      });
    }

    const dataRows = await insertDataFromFile(files);

    res.status(200).json(dataRows);
  } catch (err) {
    console.log("err::::::", err);

    next(err);
  }
};

const getBorderCrossTotal = async (req, res, next) => {
  try {
    const { year, period, month, borderCross } = req.body;
    const data = await getBorderCrossTotalDb({
      year,
      period,
      month,
      borderCross,
    });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const getBorderCrossCountries = async (req, res, next) => {
  try {
    const { year, period, month } = req.body;
    const data = await getBorderCrossCountriesDb({ year, period, month });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const getBorderCrossPeriods = async (req, res, next) => {
  try {
    const { year, period, month } = req.body;
    const data = await getBorderCrossPeriodsDb({
      year,
      period,
      month,
    });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const getSimpleWPStatistics = async (req, res, next) => {
  try {
    const { wp_type, decType, report_type, year, period, month, claim_type } =
      req.body;
    const data = await getSimpleWPStatisticsDb({
      wp_type,
      report_type,
      decType,
      year,
      period,
      month,
      claim_type,
    });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const getStatisticsPeriodsData = async (req, res, next) => {
  try {
    const { statisticsType } = req.params;
    const data = await getStatisticsPeriodsDataDb(statisticsType);

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAsylumTotal,
  getAsylumApplications,
  getAsylumDecisions,
  getAsylumYears,
  uploadBorderCrossFile,
  getBorderCrossTotal,
  getBorderCrossCountries,
  getBorderCrossPeriods,
  getSimpleWPStatistics,
  exportExcel,
  exportPdf,
  getStatisticsPeriodsData,
};
