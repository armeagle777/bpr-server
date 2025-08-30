const axios = require("axios");

const ApiError = require("../../exceptions/api-error");
const { createLog } = require("../log/services");
const {
  getPetRegisterRequestOptions,
  formatPetRegisterResponse,
  getCompanySearchRequestOptions,
  formatCompaniesSearchParams,
} = require("./helpers");
const { logTypesMap } = require("../../utils/constants");

const getCompaniesBySsnDb = async (req) => {
  const { ssn } = req.params;
  await createLog({ req, fields: { ssn } });

  const config = getPetRegisterRequestOptions(ssn);
  const { data } = await axios(config);

  if (data.error) {
    return [];
  }

  const result = formatPetRegisterResponse(data);

  return result;
};

const searchCompaniesDb = async (req) => {
  const searchParams = req.query;
  const formatedParams = formatCompaniesSearchParams(searchParams);

  await createLog({
    req,
    fields: formatedParams,
    LOG_TYPE_NAME: logTypesMap.petRegister.name,
  });

  const config = getCompanySearchRequestOptions(formatedParams);
  const { data } = await axios(config);

  if (data.error) {
    return [];
  }
  const company = data?.br_company_info_response?.br_company;
  if (!company || !Object.keys(company)?.length) return [];

  return [company];
};

module.exports = {
  searchCompaniesDb,
  getCompaniesBySsnDb,
};
