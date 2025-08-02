const {
  getCountriesDB,
  filterWpPersonsDB,
  getWpPersonFullInfoDB,
} = require("./services");

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
    const persons = await filterWpPersonsDB(req);
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
  getWpCountries,
  getWpPersonFullInfo,
  filterWpPersons,
};
