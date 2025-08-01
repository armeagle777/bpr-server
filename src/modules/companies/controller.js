const { getCompaniesBySsnDb } = require("./services");

const getCompaniesBySsn = async (req, res, next) => {
  try {
    const { ssn } = req.params;

    const companies = await getCompaniesBySsnDb(ssn);

    res.status(200).json(companies);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCompaniesBySsn,
};
