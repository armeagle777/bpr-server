const axios = require("axios");

const { getECivilRequestOptions } = require("./helpers");

const getECivilDocumentsDB = async (params) => {
  try {
    const axiosOptions = getECivilRequestOptions(params, "get_act");
    const response = await axios(axiosOptions);

    const { status, result } = response.data;

    if (!result) return null;

    const documents = Object.values(result);
    return documents;
  } catch (error) {
    console.log("Error getting BPR data: ", error);
    return null;
  }
};

module.exports = {
  getECivilDocumentsDB,
};
