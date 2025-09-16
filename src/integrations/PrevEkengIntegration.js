const qs = require("qs");

class PreviousEkengIntegration {
  buildRequestOptions(url, data) {
    const queryData = qs.stringify(data);
    return {
      method: "post",
      url: `${process.env.PREVIOUS_EKENG_URL}/${url}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: queryData,
    };
  }
}

module.exports = PreviousEkengIntegration;
