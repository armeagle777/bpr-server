const axios = require("axios");

const { createLog } = require("../log/services");
const { getMojCivilRequestOptions } = require("./helpers");
const { logTypesMap } = require("../../utils/constants");

const getCivilCaseDataDB = async (req) => {
  const { psn } = req.params;

  const params = { social_number: psn };

  await createLog({
    req,
    fields: params,
    LOG_TYPE_NAME: logTypesMap.mojCivil.name,
  });

  const axiosOptions = getMojCivilRequestOptions(
    params,
    "get_person_case_info/v1"
  );
  const { data } = await axios(axiosOptions);
  return data?.get_person_case_info_response?.data || [];
};

const getBeneficiaryDataDB = async (req) => {
  const { psn } = req.params;

  const params = { psn };

  await createLog({
    req,
    fields: params,
    LOG_TYPE_NAME: logTypesMap.mojCivil.name,
  });

  const axiosOptions = getMojCivilRequestOptions(
    params,
    "get_beneficiary_info/v1"
  );
  const { data } = await axios(axiosOptions);
  return data?.get_beneficiary_info_response?.result?.cases || [];
};

module.exports = {
  getCivilCaseDataDB,
  getBeneficiaryDataDB,
};
