const {
  getCommunitiesDB,
  getResidencesDB,
  getStreetsDB,
  searchPersonsDB,
} = require("./services");

const getCommunities = async (req, res, next) => {
  try {
    const communities = await getCommunitiesDB(req);

    res.status(200).json(communities);
  } catch (err) {
    next(err);
  }
};

const getResidences = async (req, res, next) => {
  try {
    const residences = await getResidencesDB(req);

    res.status(200).json(residences);
  } catch (err) {
    next(err);
  }
};

const getStreets = async (req, res, next) => {
  try {
    const residences = await getStreetsDB(req);

    res.status(200).json(residences);
  } catch (err) {
    next(err);
  }
};

const searchPersons = async (req, res, next) => {
  try {
    const persons = await searchPersonsDB(req);

    res.status(200).json(persons);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCommunities,
  getResidences,
  getStreets,
  searchPersons,
};
