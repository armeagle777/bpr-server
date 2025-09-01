const axios = require("axios");

const { getNorkRequestOptions } = require("./helpers");

const getPyunikRegisterInfoDB = async (doc) => {
  try {
    const axiosOptions = getNorkRequestOptions({ doc }, "pyunik_info/v1");
    const { data } = await axios(axiosOptions);
    return data?.pyunik_info_response || null;
  } catch (error) {
    console.log("Error getting Pynuik register data: ", error);
    return null;
  }
};

const getDisabilityRegisterInfoDB = async (doc) => {
  try {
    const axiosOptions = getNorkRequestOptions({ doc }, "e_disability/v1");
    const { data } = await axios(axiosOptions);
    return data?.e_disability_response || null;
  } catch (error) {
    console.log("Error getting Disability register data: ", error);
    return null;
  }
};

module.exports = {
  getPyunikRegisterInfoDB,
  getDisabilityRegisterInfoDB,
};
