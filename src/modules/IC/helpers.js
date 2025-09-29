const EkengIntegration = require("../../integrations/EkengIntegration");

const getICRequestOptions = (body, url) => {
  const weaponsUrl = `${process.env.POLICE_IC_URL}/${url}`;

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(weaponsUrl, body);

  return options;
};

module.exports = { getICRequestOptions };
