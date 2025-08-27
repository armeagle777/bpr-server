const { getPropertyTaxesDB } = require("./services");

const getPropertyTaxesData = async (req, res, next) => {
  try {
    const transactions = await getPropertyTaxesDB(req);

    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPropertyTaxesData,
};
