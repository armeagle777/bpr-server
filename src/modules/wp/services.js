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
  await createLog({ req, fields: sanitizedFilters });

  const response = await fetchFilterPersonData({
    filters: sanitizedFilters,
    page,
    pageSize,
  });
  return response?.data;
};

const getWpPersonFullInfoDB = async (req) => {
  const { tablename, user_id } = req.body;
  const { id } = req.params;

  const response = await fetchPersonFullData(id, { tablename, user_id });
  return response?.data;
};

module.exports = {
  getCountriesDB,
  filterWpPersonsDB,
  getWpPersonFullInfoDB,
};
