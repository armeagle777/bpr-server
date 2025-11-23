const axios = require("axios");

class MCSPersonsIntegration {
  constructor() {}

  buildRequestOptions(url, body) {
    return {
      method: "POST",
      maxBodyLength: Infinity,
      url,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(body),
    };
  }
}

module.exports = MCSPersonsIntegration;
