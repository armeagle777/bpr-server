const {
  getTransactionsDataDB,
  getViolationsDataDB,
  searchDrivingLicenseDB,
} = require("./services");

const getTransactionsData = async (req, res, next) => {
  try {
    const transactions = await getTransactionsDataDB(req);

    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};

const getViolationsData = async (req, res, next) => {
  try {
    const violations = await getViolationsDataDB(req);

    res.status(200).json(violations);
  } catch (err) {
    next(err);
  }
};

const searchDrivingLicenses = async (req, res, next) => {
  try {
    const licenses = await searchDrivingLicenseDB(req);

    res.status(200).json(licenses);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getViolationsData,
  getTransactionsData,
  searchDrivingLicenses,
};
