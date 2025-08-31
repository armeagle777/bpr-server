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
  console.log("searchParams>>>>>>", searchParams);
  const axiosOptions = getTerritorialMinistryRequestOptions(
    searchParams,
    "get_taxes/v1"
  );
  const { data } = await axios(axiosOptions);

  return (
    data?.mta_get_taxes_response?.physical_vehicles?.physical_vehicles_data ||
    data?.mta_get_taxes_response?.physical_real_estate
      ?.physical_real_estate_data ||
    data?.mta_get_taxes_response?.legal_vehicles?.legal_vehicles_data ||
    data?.mta_get_taxes_response?.legal_real_estate?.legal_real_estate_data ||
    []
  );
};

module.exports = {
  getPropertyTaxesDB,
};
