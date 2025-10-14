const axios = require("axios");

const { createLog } = require("../log/services");
const { getCadastreRequestOptions } = require("./helpers");
const { SEARCH_BASES } = require("./constants");
const { getCurrentDate } = require("../../utils/common");

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
  const axiosOptions = getCadastreRequestOptions({}, "get_all_regions/v1");
  const { data } = await axios(axiosOptions);
  return data?.get_all_regions_response?.data || [];
}
async function getAllCommunities() {
  const axiosOptions = getCadastreRequestOptions({}, "get_communities/v1");
  const { data } = await axios(axiosOptions);
  return data?.get_communities_response?.data || [];
}

module.exports = {
  getAllRegions,
  getAllCommunities,
  getPropertyByCertificateDb,
};
