const axios = require("axios");

const { getAVVRequestOptions } = require("./helpers");

const getPersonBPRDataDB = async (params) => {
  try {
    const axiosOptions = getAVVRequestOptions(params, "search");
    const response = await axios(axiosOptions);

    const { status, result } = response.data;

    if (status === "failed" || !result.length) {
      return null;
    }

    return result;
  } catch (error) {
    console.log("Error getting BPR data: ", error);
    return null;
  }
};

module.exports = {
  getPersonBPRDataDB,
};
