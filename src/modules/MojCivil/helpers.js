const EkengIntegration = require("../../integrations/EkengIntegration");

const getMojCivilRequestOptions = (body, path) => {
  const mojCivilURl = `${process.env.MOJ_CIVIL_API_URL}/${path}`;

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(mojCivilURl, body);

  return options;
};

module.exports = { getMojCivilRequestOptions };
