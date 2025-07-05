const fs = require("fs");
const XLSX = require("xlsx");
const v4 = require("uuid").v4;
const Sequelize = require("sequelize");

const {
  monthsMap,
  statByYearQuery,
  statisticsSequelize,
  decTypeTableNameMap,
  reportsBasicData,
} = require("./constants");
const {
  formatAsylumQuery,
  formatTotalAsylumQuery,
  formatTotalBorderCrossQuery,
  formatPeriodBorderCrossQuery,
  formatCountryBorderCrossQuery,
  formatEaeuEmployeeQuery,
  formatEaeuEmployeeFamQuery,
  formatWpQuery,
  formatVolunteerQuery,
  formatEaeuOfficialQuery,
  formatEaeuEmployeeFamOfficialQuery,
  formatWpOfficialQuery,
  mapWpData,
  mapEaeuFamData,
  formatStatisticsPeriodsQuery,
} = require("./helpers");
const { Cross, sahmanahatumSequelize } = require("../../config/sahmanahatumDb");
const { createPDF } = require("../../utils/common");
const { wpSequelize } = require("../../config/wpDatabase");

const fakeData = {
  title: "A new Brazilian School",
  date: "05/12/2018",
  name: "Rodolfo",
  age: 28,
  birthdate: "12/07/1990",
  course: "Computer Science",
  obs: "Graduated in 2014 by Federal University of Lavras, work with Full-Stack development and E-commerce.",
};

const getAsylumTotalDb = async ({ year, period, month }) => {
  const query = formatTotalAsylumQuery({
    year,
    month,
    period,
  });

  const statData = await statisticsSequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });

  return statData;
};

const getAsylumApplicationsDb = async ({ year, period, month }) => {
  const query = formatAsylumQuery({
    table_name: "applied_for_asylum",
    year,
    month,
    period,
  });

  const statData = await statisticsSequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });

  return statData;
};

const getAsylumDecisionsDb = async ({ year, period, decType, month }) => {
  const query = formatAsylumQuery({
    table_name: decTypeTableNameMap[decType],
    year,
    month,
    period,
  });
  const statData = await statisticsSequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });
  return statData;
};

const getAsylumYearsDb = async () => {
  const statData = await statisticsSequelize.query(statByYearQuery, {
    type: Sequelize.QueryTypes.SELECT,
  });
  return statData.map((row) => ({
    ...row,
    period_year: String(row.period_year),
    key: row.period_year,
  }));
};

const insertDataFromFile = async (files) => {
  const excelDocument = files.filepond;
  const filePath = "./src/public/" + v4() + "_" + excelDocument.name;
  await excelDocument.mv(filePath);

  const workBook = XLSX.readFile(filePath);
  const workSheet = workBook.Sheets[workBook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_row_object_array(workSheet);

  const filteredData = data.reduce((acc, row) => {
    const {
      IN,
      OUT,
      Month: period,
      BP: cross_point,
      "Cross type": cross_type,
      "Doc. Country": country,
    } = row;

    if (period && cross_type && country && cross_point && IN >= 0 && OUT >= 0) {
      const [year, month] = period.split(" ");

      acc.push({
        in_count: IN,
        cross_point,
        out_count: OUT,
        year: Number(year),
        month: monthsMap[month],
        cross_type,
        country,
      });
    }

    return acc;
  }, []);

  await bulkUpsert(Cross, filteredData);
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

const getBorderCrossTotalDb = async ({ year, period, month, borderCross }) => {
  const query = formatTotalBorderCrossQuery({
    year,
    month,
    period,
    borderCross,
  });

  const statData = await sahmanahatumSequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });
  const numericData = statData.map((item) => {
    return Object.fromEntries(
      Object.entries(item).map(([key, value]) => [
        key,
        isNaN(value) ? value : +value,
      ])
    );
  });
  return numericData;
};

const getBorderCrossCountriesDb = async ({ year, period, month }) => {
  const query = formatCountryBorderCrossQuery({
    year,
    month,
    period,
  });

  const statData = await sahmanahatumSequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });

  const numericData = statData.map((item) => {
    return Object.fromEntries(
      Object.entries(item).map(([key, value]) => [
        key,
        isNaN(value) ? value : +value,
      ])
    );
  });

  return numericData;
};

const getBorderCrossPeriodsDb = async ({ year, period, month }) => {
  const query = formatPeriodBorderCrossQuery({
    year,
    month,
    period,
  });

  const statData = await sahmanahatumSequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });

  const numericData = statData.map((item) => {
    return Object.fromEntries(
      Object.entries(item).map(([key, value]) => [
        key,
        key === "main_column" || isNaN(value) ? String(value) : +value,
      ])
    );
  });
  return numericData;
};

const getSimpleWPStatisticsDb = async ({
  year,
  month,
  period,
  wp_type,
  claim_type,
  report_type,
  decType,
}) => {
  let query;
  switch (wp_type) {
    case "eaeu_employee":
      query = formatEaeuEmployeeQuery({
        year,
        month,
        period,
        claim_type,
        report_type,
        decType,
      });
      break;
    case "eaeu_employee_family":
      query = formatEaeuEmployeeFamQuery({
        year,
        month,
        period,
        claim_type,
        report_type,
        decType,
      });
      break;
    case "work_permit":
      query = formatWpQuery({
        year,
        month,
        period,
        claim_type,
        report_type,
        decType,
      });
      break;
    case "volunteer":
      query = formatVolunteerQuery({
        year,
        month,
        period,
        claim_type,
        report_type,
        decType,
      });
      break;
    default:
      return null;
  }

  const statData = await wpSequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });

  const formatedData = statData?.map((row, index) => ({ ...row, key: v4() }));
  return formatedData;
};

//TODO wp statistics
const getOfficialWPStatisticsDb = async ({
  year,
  month,
  period,
  wp_type,
  claim_type,
  report_type,
  decType,
}) => {
  let query;
  switch (wp_type) {
    case "eaeu_employee":
      query = formatEaeuOfficialQuery({
        year,
        month,
        period,
        claim_type,
        report_type,
        decType,
      });
      break;
    case "eaeu_employee_family":
      query = formatEaeuEmployeeFamOfficialQuery({
        year,
        month,
        period,
        claim_type,
        report_type,
        decType,
      });
      break;
    case "work_permit":
      query = formatWpOfficialQuery({
        year,
        month,
        period,
        claim_type,
        report_type,
        decType,
      });
      break;
    default:
      return [];
  }

  const statData = await wpSequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });

  // const formatedData = statData?.map((row, index) => ({ ...row, key: index }));
  return statData;
};

// Function to perform bulk upsert
async function bulkUpsert(model, data) {
  const query = `
      INSERT INTO ${model.getTableName()} (${Object.keys(data[0]).join(", ")})
      VALUES ${data.map(() => "(?)").join(", ")}
      ON DUPLICATE KEY UPDATE in_count = VALUES(in_count),
      out_count = VALUES(out_count)
    `;

  await sahmanahatumSequelize.query(query, {
    replacements: data.map((item) => Object.values(item)),
    type: Sequelize.QueryTypes.INSERT,
  });
}

const calculateTotals = (data) => {
  const totals = {};

  const columnsToTotal = [
    "TOTAL_APPLICATIONS_FROM_APPLICATIONS",
    "TOTAL_APPLICATIONS",
    "TOTAL_MALE",
    "TOTAL_FEMALE",
    "MALE_0_13",
    "FEMALE_0_13",
    "TOTAL_0_13",
    "MALE_14_17",
    "FEMALE_14_17",
    "TOTAL_14_17",
    "MALE_18_34",
    "FEMALE_18_34",
    "TOTAL_18_34",
    "MALE_35_64",
    "FEMALE_35_64",
    "TOTAL_35_64",
    "MALE_UNKNOWN",
    "FEMALE_UNKNOWN",
    "TOTAL_UNKNOWN",
    "MALE_65_PLUS",
    "FEMALE_65_PLUS",
    "TOTAL_65_PLUS",
  ];

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      const tableData = data[key];
      const totalObject = {};

      columnsToTotal.forEach((column) => {
        totalObject[column] = tableData.reduce(
          (sum, row) => sum + row[column],
          0
        );
      });

      totals[`${key}_totals`] = totalObject;
    }
  }

  return totals;
};

const calculateWp3Totals = (data) => {
  const totals = {};

  const columnsToTotal = [
    "grand_total",
    "total_male",
    "total_female",
    "total_under_16",
    "male_under_16",
    "female_under_16",
    "total_16_19",
    "male_16_19",
    "female_16_19",
    "total_20_24",
    "male_20_24",
    "female_20_24",
    "total_25_29",
    "male_25_29",
    "female_25_29",
    "total_30_34",
    "male_30_34",
    "female_30_34",
    "total_35_39",
    "male_35_39",
    "female_35_39",
    "total_40_44",
    "male_40_44",
    "female_40_44",
    "total_45_49",
    "male_45_49",
    "female_45_49",
    "total_50_54",
    "male_50_54",
    "female_50_54",
    "total_55_59",
    "male_55_59",
    "female_55_59",
    "total_60_64",
    "male_60_64",
    "female_60_64",
    "total_upper_65",
    "male_upper_65",
    "female_upper_65",
  ];

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      const tableData = data[key];
      const totalObject = {};

      columnsToTotal.forEach((column) => {
        totalObject[column] = tableData.reduce(
          (sum, row) => sum + row[column],
          0
        );
      });

      totals[`${key}_totals`] = totalObject;
    }
  }

  return totals;
};

const createPdfService = async (req) => {
  let tableData;
  let totalTableData = {};
  const { body } = req;
  const { filters } = body;
  const { year, period, statisticsType } = { ...filters };
  switch (statisticsType) {
    case "asylum":
      {
        if (period === "annual") {
          const table_annual_1 = await getAsylumDecisionsDb({
            year,
            period: "annual",
            decType: "2",
          });
          const table_annual_2_a = await getAsylumDecisionsDb({
            year,
            period: "annual",
            decType: "1",
          });
          const table_annual_2_b = await getAsylumDecisionsDb({
            year,
            period: "annual",
            decType: "4",
          });
          tableData = { table_annual_1, table_annual_2_a, table_annual_2_b };
        } else if (period === "h1") {
          const table_halfOne_1 = await getAsylumApplicationsDb({
            year,
            period: "h1",
          });
          const table_halfOne_2 = await getAsylumDecisionsDb({
            year,
            period: "h1",
            decType: "3",
          });
          const table_halfOne_3 = await getAsylumDecisionsDb({
            year,
            period: "h1",
            decType: "2",
          });
          const table_halfOne_4_a = await getAsylumDecisionsDb({
            year,
            period: "h1",
            decType: "1",
          });
          const table_halfOne_4_b = await getAsylumDecisionsDb({
            year,
            period: "h1",
            decType: "4",
          });

          tableData = {
            table_halfOne_1,
            table_halfOne_2,
            table_halfOne_3,
            table_halfOne_4_a,
            table_halfOne_4_b,
          };
        } else if (period === "h2") {
          const table_halfTwo_1 = await getAsylumApplicationsDb({
            year,
            period: "h2",
          });
          const table_halfTwo_2 = await getAsylumDecisionsDb({
            year,
            period: "h2",
            decType: "3",
          });
          const table_halfTwo_3 = await getAsylumDecisionsDb({
            year,
            period: "h2",
            decType: "2",
          });
          const table_halfTwo_4_a = await getAsylumDecisionsDb({
            year,
            period: "h2",
            decType: "1",
          });
          const table_halfTwo_4_b = await getAsylumDecisionsDb({
            year,
            period: "h2",
            decType: "4",
          });

          tableData = {
            table_halfTwo_1,
            table_halfTwo_2,
            table_halfTwo_3,
            table_halfTwo_4_a,
            table_halfTwo_4_b,
          };
        }
        totalTableData = calculateTotals(tableData);
      }
      break;
    case "wp_1":
      {
        const table_1_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "eaeu_employee",
          claim_type: "all",
          report_type: 1,
        });
        const table_2_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "eaeu_employee",
          claim_type: "all",
          report_type: 2,
          decType: "allow",
        });
        const table_3_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "eaeu_employee",
          claim_type: "all",
          report_type: 2,
          decType: "cease",
        });

        const table_4_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "eaeu_employee",
          claim_type: "all",
          report_type: 2,
          decType: "reject",
        });

        const table_5_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "eaeu_employee",
          claim_type: "all",
          report_type: 2,
          decType: "terminate",
        });

        tableData = {
          table_1_data: mapWpData(table_1_data),
          table_2_data: mapWpData(table_2_data),
          table_3_data: mapWpData(table_3_data),
          table_4_data: mapWpData(table_4_data),
          table_5_data: mapWpData(table_5_data),
        };
      }
      break;
    case "wp_2":
      {
        const table_1_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "eaeu_employee_family",
          claim_type: "all",
          report_type: 1,
        });
        const table_2_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "eaeu_employee_family",
          claim_type: "all",
          report_type: 2,
          decType: "allow",
        });
        const table_3_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "eaeu_employee_family",
          claim_type: "all",
          report_type: 2,
          decType: "cease",
        });
        const table_4_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "eaeu_employee_family",
          claim_type: "all",
          report_type: 2,
          decType: "reject",
        });

        tableData = {
          table_1_data: mapEaeuFamData(table_1_data),
          table_2_data: mapEaeuFamData(table_2_data),
          table_3_data: mapEaeuFamData(table_3_data),
          table_4_data: mapEaeuFamData(table_4_data),
        };
      }
      break;
    case "wp_3":
      {
        const table_1_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "work_permit",
          claim_type: "all",
          report_type: 1,
        });

        const table_2_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "work_permit",
          claim_type: "all",
          report_type: 2,
          decType: "allow",
        });
        const table_3_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "work_permit",
          claim_type: "all",
          report_type: 2,
          decType: "reject",
        });
        const table_4_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "work_permit",
          claim_type: "all",
          report_type: 2,
          decType: "cease",
        });
        const table_5_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "work_permit",
          claim_type: "all",
          report_type: 2,
          decType: "terminate",
        });
        const table_6_data = await getOfficialWPStatisticsDb({
          year,
          period,
          wp_type: "work_permit",
          claim_type: "all",
          report_type: 2,
          decType: "terminate",
        });

        tableData = {
          table_1_data,
          table_2_data,
          table_3_data,
          table_4_data,
          table_5_data,
          table_6_data,
        };
        totalTableData = calculateWp3Totals(tableData);
      }
      break;
    default:
      tableData = {};
  }

  const fileName = await createPDF({
    data: { reportsBasicData, tableData, totalTableData, year, period },
    statisticsType,
    period,
  });
  return fileName;
};

const getStatisticsPeriodsDataDb = async (statisticsType) => {
  const query = formatStatisticsPeriodsQuery(statisticsType);
  const sequelizeClient =
    statisticsType === "asylum"
      ? statisticsSequelize
      : statisticsType === "sahmanahatum"
      ? sahmanahatumSequelize
      : wpSequelize;

  const periodsData = await sequelizeClient.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });

  const formatedYears = periodsData.map(({ Year }) => ({
    label: `${Year}`,
    value: Year,
    key: Year,
  }));
  return formatedYears;
};

module.exports = {
  getAsylumTotalDb,
  getAsylumYearsDb,
  createPdfService,
  insertDataFromFile,
  getAsylumDecisionsDb,
  getBorderCrossTotalDb,
  getAsylumApplicationsDb,
  getBorderCrossPeriodsDb,
  getSimpleWPStatisticsDb,
  getBorderCrossCountriesDb,
  getStatisticsPeriodsDataDb,
};
