const { parse, differenceInYears } = require("date-fns");

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

const filterPersons = (data, filters) => {
  return data.filter((item) => {
    //Age Filtering
    const birthDate = item.avv_documents?.find((doc) => doc.person?.birth_date)
      ?.person?.birth_date;
    const date = parse(birthDate, "dd/MM/yyyy", new Date());
    const age = differenceInYears(new Date(), date);
    const ageCheck =
      (filters.age.min === null || age >= filters.age.min) &&
      (filters.age.max === null || age <= filters.age.max);

    // Gender Filtering
    const sex = item.avv_documents?.find((doc) => doc.person?.genus)?.person
      ?.genus;
    const genderCheck =
      (filters.gender?.trim() === "MALE" && sex?.trim() === "M") ||
      (filters.gender === "FEMALE" && sex === "F") ||
      filters.gender === "";

    return ageCheck && genderCheck;
  });
};

module.exports = {
  filterPersons,
  getMcsAddressesRequestOptions,
  getMcsPersonsRequestOptions,
  buildPersonSearchByAddressBody,
};
