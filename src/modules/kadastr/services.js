const axios = require("axios");

const { createLog } = require("../log/services");
const { getCadastreRequestOptions } = require("./helpers");

const getPropertyByCertificateDb = async (req) => {
  const { searchBase } = req.query;
  const { certificateNumber } = req.params;

  await createLog({
    req,
    fields: { [searchBase]: certificateNumber },
  });

  const axiosOptions = getCadastreRequestOptions(searchBase, certificateNumber);
  const { data } = await axios(axiosOptions);

  if (!data?.cad_get_realty_gip_response?.cad_get_realty) return [];
  return data.cad_get_realty_gip_response.cad_get_realty;
};

module.exports = {
  getPropertyByCertificateDb,
};
