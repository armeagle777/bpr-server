const { getTransactionsDataDB, getViolationsDataDB } = require("./services");

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

module.exports = {
  getViolationsData,
  getTransactionsData,
};
