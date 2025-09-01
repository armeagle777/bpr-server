const { getDebtorDataDB } = require("./services");

const getDebtorData = async (req, res, next) => {
  try {
    const transactions = await getDebtorDataDB(req);

    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDebtorData,
};
