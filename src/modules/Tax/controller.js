const {
  searchTaxPayerInfoDB,
  searchPersonIncomeInfoDB,
} = require("./services");

const searchTaxPayerInfo = async (req, res, next) => {
  try {
    const taxPayerData = await searchTaxPayerInfoDB(req);

    res.status(200).json(taxPayerData);
  } catch (err) {
    next(err);
  }
};

const searchPersonIncomeInfo = async (req, res, next) => {
  try {
    const personIncomeData = await searchPersonIncomeInfoDB(req);

    res.status(200).json(personIncomeData);
  } catch (err) {
    next(err);
  }
};

module.exports = { searchPersonIncomeInfo, searchTaxPayerInfo };
