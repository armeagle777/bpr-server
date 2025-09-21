const { getCivilCaseDataDB } = require("./services");

const getCivilCasesData = async (req, res, next) => {
  try {
    const cases = await getCivilCaseDataDB(req);

    res.status(200).json(cases);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCivilCasesData,
};
