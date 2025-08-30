const axios = require("axios");

const ApiError = require("../../exceptions/api-error");
const { createLog } = require("../log/services");
const {
  getPetRegisterRequestOptions,
  formatPetRegisterResponse,
} = require("./helpers");

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
  console.log(";searchParams", searchParams);
  // await createLog({ req, fields: { ssn } });

  // const config = getPetRegisterRequestOptions(ssn);
  // const { data } = await axios(config);

  // if (data.error) {
  //   return [];
  // }

  // const result = formatPetRegisterResponse(data);

  // return result;
};

module.exports = {
  searchCompaniesDb,
  getCompaniesBySsnDb,
};
