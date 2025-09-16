const PreviousEkengIntegration = require("../../integrations/PrevEkengIntegration");

const getECivilRequestOptions = (body, path) => {
  const civilUrl = `ecivil/${path}`;
  const ekeng = new PreviousEkengIntegration();
  const options = ekeng.buildRequestOptions(civilUrl, body);

  return options;
};

module.exports = { getECivilRequestOptions };
