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
    body,
    "get_owner_changes_info/v1"
  );
  const { data } = await axios(axiosOptions);

  if (data?.get_owner_changes_info_response?.status !== "ok") return [];
  return data.get_owner_changes_info_response.result;
};

module.exports = {
  getTransactionsDataDB,
};
