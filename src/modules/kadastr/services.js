const axios = require("axios");

const { createLog } = require("../log/services");
const { getCadastreRequestOptions } = require("./helpers");
const { SEARCH_BASES } = require("./constants");
const { getCurrentDate } = require("../../utils/common");
const { Community, Region, Settlement } = require("../../config/database");

const getPropertyByCertificateDb = async (req) => {
  const { searchBase } = req.query;
  const { certificateNumber } = req.params;

  await createLog({
    req,
    fields: { [searchBase]: certificateNumber },
  });

  const searchProp = SEARCH_BASES[searchBase] || SEARCH_BASES.cert_number;

  const postData = {
    [searchProp]: certificateNumber,
    date_from: "01/01/1970",
    date_to: getCurrentDate(),
  };

  const axiosOptions = getCadastreRequestOptions(postData, "get_realty_gip/v1");
  const { data } = await axios(axiosOptions);

  if (!data?.cad_get_realty_gip_response?.cad_get_realty) return [];
  return data.cad_get_realty_gip_response.cad_get_realty;
};

async function getAllRegions() {
  const regions = await Region.findAll({
    attributes: ["id", "region_code", "name"],
    order: [["name", "ASC"]],
  });

  return regions;
}

async function getAllCommunities(req) {
  const { regionId } = req.query;
  if (!regionId) return [];
  const communities = await Community.findAll({
    where: { region_id: regionId },
    attributes: ["id", "community_code", "name"],
    order: [["name", "ASC"]],
  });

  return communities;
}

async function getAllSettlements(req) {
  const { communityId } = req.query;
  if (!communityId) return [];
  const settlements = await Settlement.findAll({
    where: { community_id: communityId },
    attributes: ["id", "settlement_code", "name"],
    order: [["name", "ASC"]],
  });

  return settlements;
}

module.exports = {
  getAllRegions,
  getAllCommunities,
  getAllSettlements,
  getPropertyByCertificateDb,
};
