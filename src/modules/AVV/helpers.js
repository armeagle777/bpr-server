const PreviousEkengIntegration = require("../../integrations/PrevEkengIntegration");

const getAVVRequestOptions = (body, path) => {
  const avvUrl = `avv/${path}`;
  const ekeng = new PreviousEkengIntegration();
  const options = ekeng.buildRequestOptions(avvUrl, body);

  return options;
};

module.exports = { getAVVRequestOptions };
