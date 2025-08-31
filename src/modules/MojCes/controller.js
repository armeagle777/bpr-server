const { getTransactionsDataDB } = require("./services");

const getTransactionsData = async (req, res, next) => {
  try {
    const transactions = await getTransactionsDataDB(req);

    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTransactionsData,
};
