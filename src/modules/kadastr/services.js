const https = require("https");
const axios = require("axios");
const fs = require("fs");
const crypto = require("crypto");
const { getCurrentDate } = require("../../utils/common");
const { SEARCH_BASES } = require("./constants");
const { createLog } = require("../log/services");

const getPropertyByCertificateDb = async (req) => {
  const { certificateNumber } = req.params;
  const { searchBase } = req.query;
  const kadastrUrl = process.env.KADASTR_CERTIFICATE_URL;
  const privateKey = fs.readFileSync("./src/ekeng-request.key", "utf8");
  const certificate = fs.readFileSync("./src/ekeng-request.pem", "utf8");

  await createLog({
    req,
    fields: { [searchBase]: certificateNumber },
  });
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
  getPropertyByCertificateDb,
};
