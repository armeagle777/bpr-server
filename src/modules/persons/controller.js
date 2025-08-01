const {
  getTaxBySsnDb,
  getPersonBySsnDb,
  searchVehiclesDb,
  getPoliceByPnumDb,
  getCompanyByHvhhDb,
  getDocumentsBySsnDb,
  getRoadpoliceBySsnDb,
  getSearchedPersonsDb,
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

const getTaxBySsn = async (req, res, next) => {
  try {
    const { ssn } = req.params;
    const person = await getTaxBySsnDb(ssn);

    res.status(200).json(person);
  } catch (err) {
    next(err);
  }
};

const getRoadpoliceBySsn = async (req, res, next) => {
  try {
    const { ssn } = req.params;
    const person = await getRoadpoliceBySsnDb(ssn);

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
    const { pnum } = req.params;
    const person = await getPoliceByPnumDb(pnum);

    res.status(200).json(person);
  } catch (err) {
    next(err);
  }
};

const getQkagInfoBySsn = async (req, res, next) => {
  try {
    const { ssn } = req.params;
    const { firstName, lastName } = req.body;

    const documents = await getDocumentsBySsnDb(ssn, firstName, lastName);

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

module.exports = {
  getPersonBySsn,
  getSearchedPersons,
  getQkagInfoBySsn,
  getTaxBySsn,
  getCompanyByHvhh,
  getPoliceByPnum,
  getRoadpoliceBySsn,
  searchVehicle,
};
