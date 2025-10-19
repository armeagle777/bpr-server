const {
  getPropertyByCertificateDb,
  getAllRegions,
  getAllCommunities,
  getAllSettlements,
} = require("./services");

const getPropertyByCertificate = async (req, res, next) => {
  try {
    const property = await getPropertyByCertificateDb(req);

    res.status(200).json(property);
  } catch (err) {
    next(err);
  }
};

const getOptionsRegions = async (req, res, next) => {
  try {
    const regions = await getAllRegions(req);

    res.status(200).json(regions);
  } catch (err) {
    next(err);
  }
};

const getOptionsCommunities = async (req, res, next) => {
  try {
    const communities = await getAllCommunities(req);

    res.status(200).json(communities);
  } catch (err) {
    next(err);
  }
};

const getOptionsSettlements = async (req, res, next) => {
  try {
    const settlements = await getAllSettlements(req);

    res.status(200).json(settlements);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOptionsRegions,
  getOptionsCommunities,
  getOptionsSettlements,
  getPropertyByCertificate,
};
