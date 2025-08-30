const { getCompaniesBySsnDb, searchCompaniesDb } = require("./services");

const getCompaniesBySsn = async (req, res, next) => {
  try {
    const companies = await getCompaniesBySsnDb(req);

    res.status(200).json(companies);
  } catch (err) {
    next(err);
  }
};

const searchCompanies = async (req, res, next) => {
  try {
    const companies = await searchCompaniesDb(req);

    res.status(200).json(companies);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  searchCompanies,
  getCompaniesBySsn,
};
