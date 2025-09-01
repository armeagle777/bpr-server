const axios = require("axios");

const { createLog } = require("../log/services");
const { getMojCesRequestOptions } = require("./helpers");
const { logTypesMap } = require("../../utils/constants");

const getDebtorDataDB = async (req) => {
  const { body } = req;

  const sanitizedProps = Object.fromEntries(
    Object.entries(body)?.filter(([_, v]) => Boolean(v))
  );
  await createLog({
    req,
    fields: sanitizedProps,
    LOG_TYPE_NAME: logTypesMap.mojCes.name,
  });

  const axiosOptions = getMojCesRequestOptions(
    sanitizedProps,
    "get_debtor_info/v1"
  );
  const { data } = await axios(axiosOptions);
  return data?.cer_get_debtor_response?.cer_get_debtor_inquests || [];
};

module.exports = {
  getDebtorDataDB,
};
