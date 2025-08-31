const EkengIntegration = require("../../integrations/EkengIntegration");

const getRoadPoliceRequestOptions = (body, path) => {
  const roadPoliceUrl = `${process.env.ROADPOLICE_URL}/${path}`;

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(roadPoliceUrl, body);

  return options;
};

module.exports = { getRoadPoliceRequestOptions };
