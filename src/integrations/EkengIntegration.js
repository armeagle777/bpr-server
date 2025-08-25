const fs = require("fs");
const https = require("https");
const crypto = require("crypto");

class EkengIntegration {
  privateKey = fs.readFileSync("./src/certificates/ekeng-request.key", "utf8");
  certificate = fs.readFileSync("./src/certificates/ekeng-request.pem", "utf8");

  constructor() {
    this.agent = new https.Agent({
      key: this.privateKey,
      cert: this.certificate,
      rejectUnauthorized: false,
    });
  }

  // Helper for signing the body
  signData(data) {
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(data);
    sign.end();
    return sign.sign(this.privateKey, "base64");
  }

  // Main method to build request options
  buildRequestOptions(url, body) {
    const postData = JSON.stringify(body);
    const signature = this.signData(postData);

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
      httpsAgent: this.agent,
    };
  }
}

module.exports = EkengIntegration;
