const axios = require("axios");

const { getAVVRequestOptions } = require("./helpers");
const ApiError = require("../../exceptions/api-error");

const getPersonAVVDataDB = async (params) => {
  try {
    const axiosOptions = getAVVRequestOptions(params, "search");
    const response = await axios(axiosOptions);
    const { status, result } = response.data;

    if (
      status === "failed" &&
      !response?.data?.message?.includes("Error code: 10")
    ) {
      throw ApiError.BadGateway("Ծառայությունը ժամանակավորապես անհասանելի է");
    }

    return result;
  } catch (error) {
    console.log("Error getting BPR data: ", error);
    throw ApiError.BadGateway("Ծառայությունը ժամանակավորապես անհասանելի է");
  }
};

module.exports = {
  getPersonAVVDataDB,
};
