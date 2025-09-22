const { getCivilCaseDataDB, getBeneficiaryDataDB } = require("./services");

const getCivilCasesData = async (req, res, next) => {
  try {
    const cases = await getCivilCaseDataDB(req);

    res.status(200).json(cases);
  } catch (err) {
    next(err);
  }
};

const getBeneficiaryData = async (req, res, next) => {
  try {
    const data = await getBeneficiaryDataDB(req);

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCivilCasesData,
  getBeneficiaryData,
};
