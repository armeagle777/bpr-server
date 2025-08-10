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

const fetchCountriesData = async () => {
  return migrationAxiosInstance.get("/work-permit/countries");
};

const fetchFilterPersonData = async (body) => {
  const postData = JSON.stringify(body);
  const axiosOptions = createAxiosOptionsWithSignature(
    postData,
    "/work-permit/persons/filter"
  );
  return migrationAxiosInstance(axiosOptions);
};

const fetchPersonFullData = async (id, body) => {
  const postData = JSON.stringify(body);
  const axiosOptions = createAxiosOptionsWithSignature(
    postData,
    `/work-permit/persons/detail/${id}`
  );
  return migrationAxiosInstance(axiosOptions);
};

const fetchPersonWpLightData = async (pnum) => {
  const postData = JSON.stringify({ pnum });
  const axiosOptions = createAxiosOptionsWithSignature(
    postData,
    `/work-permit/persons/detail/pnum`
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
  fetchCountriesData,
  fetchPersonFullData,
  fetchPersonWpLightData,
  fetchFilterPersonData,
};
