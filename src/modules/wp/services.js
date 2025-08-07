const { fetchWpData } = require("./helpers");

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
};

module.exports = {
  getCountriesDB,
  filterWpPersonsDB,
  getWpPersonFullInfoDB,
};
