const EkengIntegration = require("../../integrations/EkengIntegration");

const getTerritorialMinistryRequestOptions = (body, path) => {
  const roadPoliceUrl = `${process.env.TERRITORIAL_MINISTRY_URL}/${path}`;

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(roadPoliceUrl, body);

  return options;
};

module.exports = { getTerritorialMinistryRequestOptions };
