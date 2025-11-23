const axios = require("axios");

const {
  getMcsAddressesRequestOptions,
  getMcsPersonsRequestOptions,
  buildPersonSearchByAddressBody,
} = require("./helpers");
const ApiError = require("../../exceptions/api-error");

const getCommunitiesDB = async (req) => {
  try {
    const region = req.query?.region;
    if (!region) return null;
    const getCommunitiesRequestOptions = getMcsAddressesRequestOptions(
      `community?region=${region}`
    );

    const { data } = await axios(getCommunitiesRequestOptions);

    return data?.rcr_catalog || [];
  } catch (error) {
    console.log("Error getting communities: ", error);
    return null;
  }
};

const getResidencesDB = async (req) => {
  try {
    const region = req.query?.region;
    const community = req.query?.community;

    if (!region || !community) return null;
    const getResidencesRequestOptions = getMcsAddressesRequestOptions(
      `residence?region=${region}&community=${community}`
    );

    const { data } = await axios(getResidencesRequestOptions);

    return data?.rcr_catalog || [];
  } catch (error) {
    console.log("Error getting communities: ", error);
    return null;
  }
};

const getStreetsDB = async (req) => {
  try {
    const region = req.query?.region;
    const community = req.query?.community;
    const residence = req.query?.residence;

    if (!region || !community || (!residence && region !== "ԵՐԵՎԱՆ"))
      return null;

    const getStreetsRequestOptions = getMcsAddressesRequestOptions(
      `street?region=${region}&community=${community}${
        residence ? `&residence=${residence}` : ""
      }`
    );

    const { data } = await axios(getStreetsRequestOptions);

    return data?.s_catalog?.streets || [];
  } catch (error) {
    console.log("Error getting communities: ", error);
    return null;
  }
};

const searchPersonsDB = async (req) => {
  const body = req.body;
  const {
    addressType,
    firstName,
    lastName,
    patronomicName,
    region,
    community,
    residence,
    street,
    building,
    appartment,
  } = body || {};

  // Case of searching by birth region and community , otherwise === "LIVING"
  if (addressType === "BIRTH") return await searchPersonByBirthAddress(body);

  // Case of searching by only address
  if (!firstName && !lastName && !patronomicName) {
    return await getPersonsByAddress(body);
  }

  if (building) {
    return await searchByRegionCommunityStreetBuilding(body);
  }

  if (street) {
    return await searchByRegionCommunityStreet(body);
  }

  if (community) {
    return await searchByRegionCommunity(body);
  }

  throw ApiError.BadRequest("Որոնման պարամետրերը պակաս են");
};

// Get persons' detail data by pnum list array
async function getPersonsDetailsBySsnList(pnums) {
  const body = {
    request: {
      number: "1101",
      department: "999",
    },
    registered_addresses: "CURRENT",
    ssn_list: pnums,
  };
  const getBulkPersonsReqOptions = getMcsPersonsRequestOptions(
    "by-ssn-list",
    body
  );
  const { data } = await axios(getBulkPersonsReqOptions);
  return data?.avv_persons || [];
}

// Get all persons by registered   region, community, residence, street, building ?, appartment ?,
async function getPersonsByAddress(addressFilters) {
  const { region, community, residence, street, building, apartment } =
    addressFilters || {};
  if (
    !region ||
    !community ||
    (!residence && region !== "ԵՐԵՎԱՆ") ||
    !street ||
    (!apartment && !building)
  )
    throw ApiError.BadRequest("Որոնման պարամետրերը պակաս են");

  const body = {
    request: {
      number: "1101",
      department: "999",
    },
    regist_in_addr: "EVER_REGISTERED", //  "CURRENTLY_REGISTERED"
    region,
    community,
    residence,
    street,
    ...(building ? { building } : {}),
    ...(apartment ? { apartment } : {}),
  };
  const requestOptions = getMcsPersonsRequestOptions("by-addr", body);
  const { data } = await axios(requestOptions);
  if (!data?.ssn_list?.length) return [];
  return await getPersonsDetailsBySsnList(data.ssn_list);
}

// Search  persons' f_name ?, l_name ?, p_name ?, b_date ? by birth region and community
async function searchPersonByBirthAddress(filters) {
  const {
    region,
    community,
    firstName,
    lastName,
    patronomicName,
    birthDate,
    firstNameMatchType,
    lastNameMatchType,
    patronomicNameMatchType,
  } = filters || {};
  if (!region || !community || (!firstName && !lastName && !patronomicName))
    throw ApiError.BadRequest("Որոնման պարամետրերը պակաս են");
  const body = {
    request: {
      number: "1103",
      department: "999",
    },
    birth_region: region,
    birth_community: community,
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

  const requestOptions = getMcsPersonsRequestOptions("by-birth-addr", body);
  const { data } = await axios(requestOptions);
  if (!data?.ssn_list?.length) return [];
  return await getPersonsDetailsBySsnList(data.ssn_list);
}

// Search  person's f_name ?, l_name ?, p_name ?, b_date ? by registered region and community
async function searchByRegionCommunity(filters) {
  return searchPersonsByAddress("by-addr-rc", filters, ["region", "community"]);
}

// Search  person's f_name ?, l_name ?, p_name ?, b_date ? by registered region, community and street
async function searchByRegionCommunityStreet(filters) {
  return searchPersonsByAddress("by-addr-rcs", filters, [
    "region",
    "community",
    "street",
  ]);
}

// Search  person's f_name ?, l_name ?, p_name ?, b_date ? by registered region, community, street and building
async function searchByRegionCommunityStreetBuilding(filters) {
  return searchPersonsByAddress("by-addr-rcsb", filters, [
    "region",
    "community",
    "street",
    "building",
  ]);
}

// Generic function for searching person by region, community and street service functions
async function searchPersonsByAddress(type, filters, requiredFields) {
  const body = buildPersonSearchByAddressBody(filters, requiredFields);
  const requestOptions = getMcsPersonsRequestOptions(type, body);
  const { data } = await axios(requestOptions);
  if (!data?.ssn_list?.length) return [];
  return await getPersonsDetailsBySsnList(data.ssn_list);
}

module.exports = {
  getStreetsDB,
  getResidencesDB,
  getCommunitiesDB,
  searchPersonsDB,
};
