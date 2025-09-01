const EkengIntegration = require("../../integrations/EkengIntegration");

const getMlsaRequestOptions = (body, path) => {
  const mlsaUrl = `${process.env.MLSA_API_URL}/${path}`;

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(mlsaUrl, body);

  return options;
};

module.exports = { getMlsaRequestOptions };
