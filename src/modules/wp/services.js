const {
  fetchCountriesData,
  fetchFilterPersonData,
  fetchPersonFullData,
} = require("./helpers");

const { createLog } = require("../log/services");

const getCountriesDB = async () => {
  const { data: countries } = await fetchCountriesData();
  return countries;
};

const filterWpPersonsDB = async (req) => {
  const { page = 1, pageSize = 10, filters } = req.body;
  const sanitizedFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => Boolean(v))
  );
  const createLogFields = {
    filters: { ...sanitizedFilters },
    pagination: { page, pageSize },
  };
  await createLog({ req, fields: createLogFields });

  const response = await fetchFilterPersonData({
    filters: sanitizedFilters,
    page,
    pageSize,
  });
  return response?.data;
};

const getWpPersonFullInfoDB = async (req) => {
  const { tableName, user_id } = req.body;
  const { id } = req.params;
  await createLog({ req, fields: { id, tableName, user_id } });
  const response = await fetchPersonFullData(id, { tableName, user_id });
  return response?.data;
};

module.exports = {
  getCountriesDB,
  filterWpPersonsDB,
  getWpPersonFullInfoDB,
};
