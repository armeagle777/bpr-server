const {
  getPersonBySsnDb,
  searchVehiclesDb,
  getPoliceByPnumDb,
  getCompanyByHvhhDb,
  getDocumentsBySsnDb,
  getRoadpoliceBySsnDb,
  getSearchedPersonsDb,
  getPropertiesBySsnDb,
  getWpDataDB,
} = require("./services");

const getPersonBySsn = async (req, res, next) => {
  try {
    const person = await getPersonBySsnDb(req);

    res.status(200).json(person);
  } catch (err) {
    next(err);
  }
};

const getSearchedPersons = async (req, res, next) => {
  try {
    const persons = await getSearchedPersonsDb(req);

    res.status(200).json(persons);
  } catch (err) {
    next(err);
  }
};

const getRoadpoliceBySsn = async (req, res, next) => {
  try {
    const person = await getRoadpoliceBySsnDb(req);

    res.status(200).json(person);
  } catch (err) {
    next(err);
  }
};

const searchVehicle = async (req, res, next) => {
  try {
    const vehicles = await searchVehiclesDb(req);

    res.status(200).json(vehicles);
  } catch (err) {
    next(err);
  }
};

const getPoliceByPnum = async (req, res, next) => {
  try {
    const person = await getPoliceByPnumDb(req);

    res.status(200).json(person);
  } catch (err) {
    next(err);
  }
};

const getQkagInfoBySsn = async (req, res, next) => {
  try {
    const documents = await getDocumentsBySsnDb(req);

    res.status(200).json(documents);
  } catch (err) {
    next(err);
  }
};

const getCompanyByHvhh = async (req, res, next) => {
  try {
    const company = await getCompanyByHvhhDb(req);

    res.status(200).json(company);
  } catch (err) {
    next(err);
  }
};

const getPropertiesBySsn = async (req, res, next) => {
  try {
    const properties = await getPropertiesBySsnDb(req);

    res.status(200).json(properties);
  } catch (err) {
    next(err);
  }
};

const getWpData = async (req, res, next) => {
  try {
    const roles = await getWpDataDB(req);
    res.status(200).json(roles);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

module.exports = {
  getPersonBySsn,
  getSearchedPersons,
  getQkagInfoBySsn,
  getCompanyByHvhh,
  getPoliceByPnum,
  getRoadpoliceBySsn,
  searchVehicle,
  getPropertiesBySsn,
  getWpData,
};
