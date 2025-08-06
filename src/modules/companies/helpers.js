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

const formatPetRegisterResponse = (response) => {
  const {
    result: { person },
  } = response;

  const { companies, ...rest } = { ...person };
  return { ...rest, companies: Object.values(companies) };
};

module.exports = { getPetRegisterRequestOptions, formatPetRegisterResponse };
