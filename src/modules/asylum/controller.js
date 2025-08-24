const {
  getAsylumFullDataDB,
  filterAsylumLightDataDB,
  getAsylumFilterOptionsDB,
} = require("./services");

const getAsylumFilterOptions = async (req, res, next) => {
  try {
    const filterOptions = await getAsylumFilterOptionsDB();
    res.status(200).json(filterOptions);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const filterAsylumLightData = async (req, res, next) => {
  try {
    const persons = await filterAsylumLightDataDB(req);
    res.status(200).json(persons);
  } catch (err) {
    console.log(
      "Error Fetching Refugee Light Data:",
      err?.data?.message || err.message
    );
    next(err);
  }
};

const getAsylumFullData = async (req, res, next) => {
  try {
    const personDetailData = await getAsylumFullDataDB(req);
    res.status(200).json(personDetailData);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

module.exports = {
  getAsylumFullData,
  getAsylumFilterOptions,
  filterAsylumLightData,
};
