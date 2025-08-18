const {
  getCountriesDB,
  getAsylumFullDataDB,
  filterAsylumLightDataDB,
} = require("./services");

const getAsylumCountries = async (req, res, next) => {
  try {
    const countries = await getCountriesDB();
    res.status(200).json(countries);
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
    console.log("Error crating User:", err);
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
  getAsylumCountries,
  filterAsylumLightData,
};
