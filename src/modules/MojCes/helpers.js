const EkengIntegration = require("../../integrations/EkengIntegration");

const getMojCesRequestOptions = (body, path) => {
  const mojCesURl = `${process.env.MOJ_CES_API_URL}/${path}`;

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(mojCesURl, body);

  return options;
};

module.exports = { getMojCesRequestOptions };
