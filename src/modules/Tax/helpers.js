const EkengIntegration = require("../../integrations/EkengIntegration");

const getTaxRequestOptions = (body, path) => {
  const taxUrl = `${process.env.TAX_API_URL}/${path}`;

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(taxUrl, body);

  return options;
};

module.exports = { getTaxRequestOptions };
