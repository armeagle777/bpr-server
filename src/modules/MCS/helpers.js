const MCSAddressOptionsIntegration = require("../../integrations/MCSAddressOptionsIntegration");
const MCSPersonsIntegration = require("../../integrations/MCSPersonsIntegration");

const getMcsAddressesRequestOptions = (path) => {
  const mcsUrl = `${process.env.MCS_ADDRESS_CATALOGS_API_URL}/${path}`;

  const mcsAgent = new MCSAddressOptionsIntegration();
  const options = mcsAgent.buildRequestOptions(mcsUrl);

  return options;
};

const getMcsPersonsRequestOptions = (path, body) => {
  const mcsUrl = `${process.env.MCS_SEARCH_PERSONS_API_URL}/${path}`;

  const mcsAgent = new MCSPersonsIntegration();
  const options = mcsAgent.buildRequestOptions(mcsUrl, body);

  return options;
};

const buildPersonSearchByAddressBody = (filters, requiredFields = []) => {
  const {
    region,
    community,
    street,
    building,
    firstName,
    lastName,
    patronomicName,
    birthDate,
    firstNameMatchType,
    lastNameMatchType,
    patronomicNameMatchType,
  } = filters;

  // Validate required fields
  for (const field of requiredFields) {
    if (!filters[field]) {
      throw ApiError.BadRequest("Որոնման պարամետրերը պակաս են");
    }
  }

  if (!firstName && !lastName && !patronomicName) {
    throw ApiError.BadRequest("Պետք է մուտքագրել անուն/ազգանուն/հայրանուն");
  }

  return {
    request: { number: "1103", department: "999" },
    regist_in_addr: "EVER_REGISTERED", // OR "CURRENTLY_REGISTERED"
    ...(region && { region }),
    ...(community && { community }),
    ...(street && { street }),
    ...(building && { building }),
    additional_data: {
      ...(lastName && {
        last_name: {
          name: lastName,
          is_complete: lastNameMatchType === "exact",
        },
      }),
      ...(firstName && {
        first_name: {
          name: firstName,
          is_complete: firstNameMatchType === "exact",
        },
      }),
      ...(patronomicName && {
        patr_name: {
          name: patronomicName,
          is_complete: patronomicNameMatchType === "exact",
        },
      }),
      ...(birthDate && { birth_date: birthDate }),
    },
  };
};

module.exports = {
  getMcsAddressesRequestOptions,
  getMcsPersonsRequestOptions,
  buildPersonSearchByAddressBody,
};
