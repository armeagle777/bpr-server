const EkengIntegration = require("../../integrations/EkengIntegration");

const getNorkRequestOptions = (body, path) => {
  const norkUrl = `${process.env.NORK_API_URL}/${path}`;

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(norkUrl, body);

  return options;
};

module.exports = { getNorkRequestOptions };
