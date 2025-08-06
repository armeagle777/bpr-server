const fs = require("fs");
const https = require("https");
const crypto = require("crypto");

const { SEARCH_BASES } = require("./constants");
const { getCurrentDate } = require("../../utils/common");

const getCadastreRequestOptions = (searchBase, certificateNumber) => {
  const kadastrUrl = process.env.KADASTR_CERTIFICATE_URL;
  const searchProp = SEARCH_BASES[searchBase] || SEARCH_BASES.cert_number;

  const privateKey = fs.readFileSync(
    "./src/certificates/ekeng-request.key",
    "utf8"
  );
  const certificate = fs.readFileSync(
    "./src/certificates/ekeng-request.pem",
    "utf8"
  );

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

  return {
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
};

module.exports = { getCadastreRequestOptions };
