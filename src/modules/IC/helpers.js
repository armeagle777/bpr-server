const EkengIntegration = require("../../integrations/EkengIntegration");

const getICRequestOptions = (body) => {
  const weaponsUrl = `${process.env.POLICE_IC_URL}/get_weapon_info/v1`;

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(weaponsUrl, body);

  return options;
};

module.exports = { getICRequestOptions };
