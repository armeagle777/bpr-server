const EkengIntegration = require("../../integrations/EkengIntegration");

const getCadastreRequestOptions = (body, path) => {
  const kadastrUrl = `${process.env.CADASTRE_URL}/${path}`;

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(kadastrUrl, body);

  return options;
};

module.exports = { getCadastreRequestOptions };
