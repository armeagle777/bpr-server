const {
  getFullInfoBaseQuery,
  getFinesQuery,
  formatBaseResult,
  getClaimsQuery,
  getCardsQuery,
  getFamilyMemberQuery,
  fetchWpData,
} = require("./helpers");
const { TABLE_NAMES } = require("./constants");
const { createLog } = require("../log/services");

const getCountriesDB = async () => {
  const countries = await fetchWpData();

  return countries;
};

const filterWpPersonsDB = async (req) => {
  const { page = 1, pageSize = 10, filters } = req.body;
  const sanitizedFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => Boolean(v))
  );
  await createLog({ req, fields: sanitizedFilters });

  const response = await fetchWpData();

  return response;
};

const getWpPersonFullInfoDB = async (req) => {
  const { tablename: procedure, user_id } = req.body;
  const { id: emp_id } = req.params;

  const queries = [
    { key: "baseInfo", query: getFullInfoBaseQuery(procedure, emp_id) }, //for tab 1
    { key: "fines", query: getFinesQuery(procedure, emp_id) }, //for tab 4
    { key: "claims", query: getClaimsQuery(procedure, emp_id) }, // for tab 2
    { key: "cards", query: getCardsQuery(procedure, emp_id) }, // for tab 3
    ...(procedure === TABLE_NAMES.EAEU
      ? [
          {
            key: "familyMembers",
            query: getFamilyMemberQuery(procedure, user_id),
          },
        ]
      : []), // conditional for tab 5
  ];

  const resultsArray = await Promise.all(queries.map((q) => fetchWpData()));

  const results = {};
  queries.forEach((q, i) => {
    results[q.key] =
      q.key === "baseInfo"
        ? formatBaseResult(resultsArray[i])
        : resultsArray[i];
  });
  return results;
};

module.exports = {
  getCountriesDB,
  filterWpPersonsDB,
  getWpPersonFullInfoDB,
};
