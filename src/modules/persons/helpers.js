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
    url: `${process.env.ROADPOLICE_URL}/get_driving_license_with_info`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: axiosBody,
  };
};

const getVehiclesAxiosConfigs = (psn) => {
  const axiosBody = qs.stringify({
    psn,
    // number: "37CJ131",
    // vin: "YV1CT985681448638",
    // cert_num: "YB813789",
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
    // number: "37CJ131",
    // vin: "YV1CT985681448638",
    // cert_num: "YB813789",
  });

  return {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.ROADPOLICE_URL}/get_vehicle_info`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    timeout: 5000,
    data: axiosBody,
  };
};

const extractData = (row) => {
  const cards = [];
  const data = row?.map((row) => {
    const {
      serial_number,
      issue_date,
      expire_date,
      printed_at,
      card_status,
      transferred_at,
      ...rowData
    } = row;
    if (serial_number) {
      cards.push({
        serial_number,
        issue_date,
        expire_date,
        printed_at,
        card_status,
        transferred_at,
      });
    }
    return rowData;
  });

  return { cards, data: data ?? null };
};

const fetchWpData = async (pnum) => {
  // Modify to fetch data from Migration Service
  return null;
};

module.exports = {
  extractData,
  fetchWpData,
  getBordercrossAxiosConfigs,
  getLicensesAxiosConfigs,
  getVehiclesAxiosConfigs,
  searchVehiclesAxiosConfigs,
};
