const {
  getWpDataDB,
  getCountriesDB,
  filterWpPersonsDB,
  getWpPersonFullInfoDB,
} = require("./services");

const getWpData = async (req, res, next) => {
  try {
    const roles = await getWpDataDB(req);
    res.status(200).json(roles);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const getWpCountries = async (req, res, next) => {
  try {
    const countries = await getCountriesDB();
    res.status(200).json(countries);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const filterWpPersons = async (req, res, next) => {
  try {
    const persons = await filterWpPersonsDB(req.body);
    res.status(200).json(persons);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const getWpPersonFullInfo = async (req, res, next) => {
  try {
    const persons = await getWpPersonFullInfoDB(req);
    res.status(200).json(persons);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

module.exports = {
  getWpData,
  getWpCountries,
  getWpPersonFullInfo,
  filterWpPersons,
};
