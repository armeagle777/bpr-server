const axios = require("axios");
const fs = require("fs");
const https = require("https");
const crypto = require("crypto");

const migrationAxiosInstance = axios.create({
  baseURL: process.env.MIGRATION_SERVICE_API_URL,
});

const migrationApiHttpsAgent = new https.Agent({
  key: getRequestPrivateKey(),
  cert: getRequestCertificate(),
  rejectUnauthorized: false,
});

const fetchAsylumCountriesData = async () => {
  return migrationAxiosInstance.get("/asylum/countries");
};

const fetchAsylumPersonsFilterData = async (body) => {
  const postData = JSON.stringify(body);
  const axiosOptions = createAxiosOptionsWithSignature(
    postData,
    "/asylum/persons/filter"
  );
  return migrationAxiosInstance(axiosOptions);
};

const fetchAsylumPersonFullData = async (personalId) => {
  const fakeBody = { personalId };
  const postData = JSON.stringify(fakeBody);
  const axiosOptions = createAxiosOptionsWithSignature(
    postData,
    `/asylum/persons/detail/${personalId}`
  );
  return migrationAxiosInstance(axiosOptions);
};

function getRequestPrivateKey() {
  return fs.readFileSync("./src/certificates/migration-request.key", "utf8");
}

function getRequestCertificate() {
  return fs.readFileSync("./src/certificates/migration-request.pem", "utf8");
}

function createSignature(postData) {
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(postData);
  sign.end();
  const signature = sign.sign(getRequestPrivateKey(), "base64");
  return signature;
}

function createAxiosOptionsWithSignature(postData, url) {
  const signature = createSignature(postData);

  return {
    method: "post",
    url,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
      "X-Signature-Algorithm": "RSA-SHA256",
      "X-Signature": signature,
    },
    data: postData,
    httpsAgent: migrationApiHttpsAgent,
  };
}

module.exports = {
  fetchAsylumCountriesData,
  fetchAsylumPersonFullData,
  fetchAsylumPersonsFilterData,
};
