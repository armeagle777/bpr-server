const EkengIntegration = require("../../integrations");
const { SEARCH_BASES } = require("./constants");
const { getCurrentDate } = require("../../utils/common");

const getCadastreRequestOptions = (searchBase, certificateNumber) => {
  const kadastrUrl = process.env.KADASTR_CERTIFICATE_URL;
  const searchProp = SEARCH_BASES[searchBase] || SEARCH_BASES.cert_number;

  const postData = JSON.stringify({
    [searchProp]: certificateNumber,
    date_from: "01/01/1970",
    date_to: getCurrentDate(),
  });

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(kadastrUrl, postData);

  return options;
};

module.exports = { getCadastreRequestOptions };
