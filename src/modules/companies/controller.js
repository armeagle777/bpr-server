const { getCompaniesBySsnDb } = require("./services");

const getCompaniesBySsn = async (req, res, next) => {
  try {
    const companies = await getCompaniesBySsnDb(req);

    res.status(200).json(companies);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCompaniesBySsn,
};
