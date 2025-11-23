const axios = require("axios");

class MCSAddressOptionsIntegration {
  constructor() {}

  buildRequestOptions(url) {
    return {
      method: "GET",
      maxBodyLength: Infinity,
      url,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
}

module.exports = MCSAddressOptionsIntegration;
