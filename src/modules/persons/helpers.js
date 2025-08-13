const qs = require("qs");
const fs = require("fs");
const https = require("https");
const crypto = require("crypto");

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

  const privateKey = fs.readFileSync(
    "./src/certificates/ekeng-request.key",
    "utf8"
  );
  const certificate = fs.readFileSync(
    "./src/certificates/ekeng-request.pem",
    "utf8"
  );

  const postData = JSON.stringify({
    [key]: value,
  });

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(postData);
  sign.end();
  const signature = sign.sign(privateKey, "base64");

  const agent = new https.Agent({
    key: privateKey,
    cert: certificate,
    rejectUnauthorized: false,
  });

  return {
    method: "post",
    url: url,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
      "X-Signature-Algorithm": "RSA-SHA256",
      "X-Signature": signature,
    },
    data: postData,
    httpsAgent: agent,
  };
};

module.exports = {
  getBordercrossAxiosConfigs,
  getLicensesAxiosConfigs,
  getRoadPoliceRequestOptions,
};
