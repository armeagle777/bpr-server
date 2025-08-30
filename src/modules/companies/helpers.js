const { APPLICATION_JSON_HEADERS } = require("../../utils/constants");

const getPetRegisterRequestOptions = (ssn) => {
  const taxUrl = process.env.PETREGISTR_URL;

  const body = JSON.stringify({
    id: 1,
    jsonrpc: "2.0",
    params: { ssn },
    method: "person_info",
  });

  return {
    data: body,
    url: taxUrl,
    method: "post",
    headers: APPLICATION_JSON_HEADERS,
  };
};

const formatCompaniesSearchParams = (searchParams) => {
  return {
    ...(searchParams.taxId && { tax_id: searchParams.taxId }),
    ...(searchParams.name && { name: searchParams.name }),
    ...(searchParams.type && { type: searchParams.type }),
  };
};

const getCompanySearchRequestOptions = (body) => {
  const petRegisterSearchUrl = `${process.env.PETREGISTER_NEW_URL}/company_info/v1`;

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(petRegisterSearchUrl, body);

  return options;
};

const formatPetRegisterResponse = (response) => {
  const {
    result: { person },
  } = response;

  const { companies, ...rest } = { ...person };
  return { ...rest, companies: Object.values(companies) };
};

module.exports = {
  formatPetRegisterResponse,
  formatCompaniesSearchParams,
  getPetRegisterRequestOptions,
  getCompanySearchRequestOptions,
};
