const axios = require("axios");

const { getMlsaRequestOptions } = require("./helpers");
const {
  getDisabilityRegisterInfoDB,
  getPyunikRegisterInfoDB,
} = require("../Nork/services");
const { createLog } = require("../log/services");
const { logTypesMap } = require("../../utils/constants");

const getPensionDataDB = async (ssn) => {
  try {
    const axiosOptions = getMlsaRequestOptions({ ssn }, "get_pension/v1");
    const { data } = await axios(axiosOptions);
    return data?.get_pension_response?.data || null;
  } catch (error) {
    console.log("Error getting Pynuik register data: ", error);
    return null;
  }
};
const getSocialPaymentsDataDB = async (req) => {
  const ssn = req.params.ssn;
  console.log("ssn", ssn);
  await createLog({
    req,
    fields: { ssn },
    LOG_TYPE_NAME: logTypesMap.mlsa.name,
  });
  const pensionData = await getPensionDataDB(ssn);
  const disabilityRegisterData = await getDisabilityRegisterInfoDB(ssn);
  const pyunikRegisterData = await getPyunikRegisterInfoDB(ssn);

  return { pensionData, disabilityRegisterData, pyunikRegisterData };
};

module.exports = { getPensionDataDB, getSocialPaymentsDataDB };
