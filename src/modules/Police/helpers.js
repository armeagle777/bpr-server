const EkengIntegration = require("../../integrations/EkengIntegration");

const getPoliceRequestOptions = (body) => {
  const weaponseUrl = `${process.env.POLICE_IC_URL}/get_weapon_info/v1`;

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(weaponseUrl, body);

  return options;
};

module.exports = { getPoliceRequestOptions };
