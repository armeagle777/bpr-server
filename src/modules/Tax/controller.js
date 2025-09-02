const { searchTaxPayerInfoDB } = require("./services");

const searchTaxPayerInfo = async (req, res, next) => {
  try {
    const taxPayerData = await searchTaxPayerInfoDB(req);

    res.status(200).json(taxPayerData);
  } catch (err) {
    next(err);
  }
};

module.exports = { searchTaxPayerInfo };
