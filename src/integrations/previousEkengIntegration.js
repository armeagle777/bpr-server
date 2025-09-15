class PreviousEkengIntegration {
  buildRequestOptions(url, data) {
    const postData = JSON.stringify(data);

    return {
      method: "post",
      url: `${process.env.PREVIOUS_EKENG_URL}/${url}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: postData,
    };
  }
}

module.exports = PreviousEkengIntegration;
