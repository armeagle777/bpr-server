const axios = require("axios");

const { createLog } = require("../log/services");
const { getRoadPoliceRequestOptions } = require("./helpers");
const { logTypesMap } = require("../../utils/constants");

const getTransactionsDataDB = async (req) => {
  const psn = req.params.psn;

  await createLog({
    req,
    fields: { psn },
    LOG_TYPE_NAME: logTypesMap.roadPoliceTransactions.name,
  });

  const axiosOptions = getRoadPoliceRequestOptions(
    { psn },
    "get_owner_changes_info/v1"
  );
  const { data } = await axios(axiosOptions);

  if (
    data?.get_owner_changes_info_response?.status !== "ok" ||
    !data.get_owner_changes_info_response?.result?.length
  )
    return [];
  return data.get_owner_changes_info_response.result[0];
};

const getViolationsDataDB = async (req) => {
  const psn = req.params.psn;

  await createLog({
    req,
    fields: { psn },
    LOG_TYPE_NAME: logTypesMap.roadPoliceViolations.name,
  });

  const axiosOptions = getRoadPoliceRequestOptions(
    { psn },
    "get_violations/v1"
  );
  const { data } = await axios(axiosOptions);

  return data?.rp_get_violations_response?.rp_violations || [];
};

module.exports = {
  getViolationsDataDB,
  getTransactionsDataDB,
};
