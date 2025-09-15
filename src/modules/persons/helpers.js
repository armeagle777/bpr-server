const qs = require("qs");

const EkengIntegration = require("../../integrations/EkengIntegration");
const { defaultAddress, defaultDocument } = require("../../utils/constants");

const getBordercrossAxiosConfigs = ({ passportNumber, citizenship }) => {
  const axiosData = `<?xml version="1.0" encoding="UTF-8"?>\r\n <data>\r\n    <citizenship>${citizenship}</citizenship>\r\n    <passportNumber>${passportNumber}</passportNumber>\r\n </data>`;
  return {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.BORDERCROSS_EKENQ_URL,
    headers: {
      "Content-Type": "application/xml",
      Authorization: `Basic ${process.env.BORDERCROSS_EKENG_AUTHORIZATION}`,
      Cookie: process.env.BORDERCROSS_AXIOS_COOKIES,
    },
    data: axiosData,
  };
};

const getLicensesAxiosConfigs = (psn) => {
  const axiosBody = qs.stringify({
    psn,
  });

  return {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.ROADPOLICE_URL}/${process.env.ROADPOLICE_URL_LICENSES_PATH}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: axiosBody,
  };
};

const getRoadPoliceRequestOptions = ({ key, value }, path) => {
  const url = `${process.env.ROADPOLICE_URL}/${path}`;
  const postData = {
    [key]: value,
  };

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(url, postData);

  return options;
};

const formatBprData = (data) => {
  const { AVVDocuments, AVVAddresses, ...restInfo } = data;
  const addresses = AVVAddresses?.AVVAddress || defaultAddress;
  const documents = AVVDocuments?.Document || defaultDocument;
  return { addresses, documents, ...restInfo };
};

module.exports = {
  formatBprData,
  getLicensesAxiosConfigs,
  getBordercrossAxiosConfigs,
  getRoadPoliceRequestOptions,
};
