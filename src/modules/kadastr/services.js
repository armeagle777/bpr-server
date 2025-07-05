const https = require("https");
const axios = require("axios");
const fs = require("fs");
const crypto = require("crypto");
const { getCurrentDate } = require("../../utils/common");
const { SEARCH_BASES } = require("./constants");
const { createLog } = require("../log/services");

const getPropertiesBySsnDb = async (ssn) => {
  const kadastrUrl = process.env.KADASTR_URL;
  const privateKey = fs.readFileSync("./src/migration_am.key", "utf8");
  const certificate = fs.readFileSync(
    "./src/32837fe0_26ee_4f51_ac0d_00604a9167b4.pem",
    "utf8"
  );

  const postData = JSON.stringify({
    ssn,
    date_from: "01/01/1970",
    date_to: getCurrentDate(),
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

  const options = {
    method: "post",
    url: kadastrUrl,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
      "X-Signature-Algorithm": "RSA-SHA256",
      "X-Signature": signature,
    },
    data: postData,
    httpsAgent: agent,
  };
  const { data } = await axios(options);
  if (!data?.cad_get_realty_owned_response?.owned_realties) return [];

  return data.cad_get_realty_owned_response.owned_realties;
};

const getPropertyByCertificateDb = async (req) => {
  const { certificateNumber } = req.params;
  const { searchBase } = req.query;

  const kadastrUrl = process.env.KADASTR_CERTIFICATE_URL;
  const privateKey = fs.readFileSync("./src/migration_am.key", "utf8");
  const certificate = fs.readFileSync(
    "./src/32837fe0_26ee_4f51_ac0d_00604a9167b4.pem",
    "utf8"
  );

  await createLog({ req, logText: certificateNumber });
  const searchProp = SEARCH_BASES[searchBase] || "cert_number";
  const postData = JSON.stringify({
    [searchProp]: certificateNumber,
    date_from: "01/01/1970",
    date_to: getCurrentDate(),
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

  const options = {
    method: "post",
    url: kadastrUrl,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
      "X-Signature-Algorithm": "RSA-SHA256",
      "X-Signature": signature,
    },
    data: postData,
    httpsAgent: agent,
  };
  const { data } = await axios(options);
  if (!data?.cad_get_realty_gip_response?.cad_get_realty) return [];
  return data.cad_get_realty_gip_response.cad_get_realty;
};

module.exports = {
  getPropertiesBySsnDb,
  getPropertyByCertificateDb,
};
