const axios = require("axios");
const fs = require("fs");
const https = require("https");
const crypto = require("crypto");

const migrationAxiosInstance = axios.create({
  baseURL: process.env.MIGRATION_SERVICE_API_URL,
});

// const migrationApiHttpsAgent = new https.Agent({
//   key: getRequestPrivateKey(),
//   cert: getRequestCertificate(),
//   rejectUnauthorized: false,
// });

// const fetchWpDataExample = async () => {
//   const postData = JSON.stringify({
//     [searchProp]: certificateNumber,
//     date_from: "01/01/1970",
//     ssn: "2721801111",
//   });
//   const axiosOptions = createAxiosOptionsWithSignature(postData);
//   return migrationAxiosInstance(axiosOptions);
// };

const fetchCountriesData = async () => {
  return migrationAxiosInstance.get("/work-permit/countries");
};

const fetchFilterPersonData = async (body) => {
  return migrationAxiosInstance.post("/work-permit/persons/filter", body);
};

const fetchPersonFullData = async (id, body) => {
  return migrationAxiosInstance.post(`/work-permit/persons/detail/${id}`, body);
};

const fetchPersonWpLightData = async (pnum) => {
  return migrationAxiosInstance.get(`/work-permit/persons/${pnum}`);
};

// function getRequestPrivateKey() {
//   return fs.readFileSync("./src/certificates/migration-api.key", "utf8");
// }

// function getRequestCertificate() {
//   return fs.readFileSync("./src/certificates/migration-api.pem", "utf8");
// }

// function createSignature(postData) {
//   const sign = crypto.createSign("RSA-SHA256");
//   sign.update(postData);
//   sign.end();
//   const signature = sign.sign(privateKey, "base64");
//   return signature;
// }

// function createAxiosOptionsWithSignature(postData, url) {
//   const signature = createSignature(postData);

//   return {
//     method: "post",
//     url,
//     headers: {
//       "Content-Type": "application/json",
//       "Content-Length": Buffer.byteLength(postData),
//       "X-Signature-Algorithm": "RSA-SHA256",
//       "X-Signature": signature,
//     },
//     data: postData,
//     httpsAgent: migrationApiHttpsAgent,
//   };
// }

module.exports = {
  fetchCountriesData,
  fetchPersonFullData,
  fetchPersonWpLightData,
  fetchFilterPersonData,
};
