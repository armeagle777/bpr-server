const qs = require("qs");

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

const getVehiclesAxiosConfigs = (psn) => {
  const axiosBody = qs.stringify({
    psn,
  });

  return {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.ROADPOLICE_URL}/get_vehicle_info`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: axiosBody,
  };
};

const searchVehiclesAxiosConfigs = (key, value) => {
  const axiosBody = qs.stringify({
    [key]: value,
  });

  return {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.ROADPOLICE_URL}/${process.env.ROADPOLICE_URL_VEHICLES_PATH}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    timeout: 5000,
    data: axiosBody,
  };
};

module.exports = {
  getBordercrossAxiosConfigs,
  getLicensesAxiosConfigs,
  getVehiclesAxiosConfigs,
  searchVehiclesAxiosConfigs,
};
