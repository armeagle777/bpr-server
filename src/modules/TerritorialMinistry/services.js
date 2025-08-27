const axios = require("axios");

const { createLog } = require("../log/services");
const ApiError = require("../../exceptions/api-error");
const { getTerritorialMinistryRequestOptions } = require("./helpers");
const { logTypesMap } = require("../../utils/constants");
const {
  identKeysMap,
  personTypesMap,
  serviceTypesMap,
} = require("./constants");

const getPropertyTaxesDB = async (req) => {
  const identificator = req.params.identificator;
  const { personType = "PHYSICAL", serviceType = "VEHICLES" } = req.query;

  const personTypeValue = personTypesMap[personType];
  const serviceTypeValue = serviceTypesMap[serviceType];
  const identificationKey = identKeysMap[personType];

  if (!personTypeValue || !serviceTypeValue)
    throw ApiError.BadRequest("Սխալ պարամետրեր");

  const searchParams = {
    [identificationKey]: identificator,
    person_type: personTypeValue,
    service_type: serviceTypeValue,
    period: "annual",
  };

  await createLog({
    req,
    fields: searchParams,
    LOG_TYPE_NAME: logTypesMap.territorialMinPropertyTaxes.name,
  });

  const axiosOptions = getTerritorialMinistryRequestOptions(
    searchParams,
    "get_taxes/v1"
  );
  const { data } = await axios(axiosOptions);

  if (
    data?.get_owner_changes_info_response?.status !== "ok" ||
    !data.get_owner_changes_info_response?.result?.length
  )
    return [];
  return data.get_owner_changes_info_response.result[0];
};

module.exports = {
  getPropertyTaxesDB,
};
