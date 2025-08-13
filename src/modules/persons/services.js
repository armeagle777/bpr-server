const axios = require("axios");
const qs = require("qs");
const { defaultAddress, defaultDocument } = require("../../utils/constants");

const ApiError = require("../../exceptions/api-error");
const { createLog } = require("../log/services");
const { getRoadPoliceRequestOptions } = require("./helpers");
const { getCadastreRequestOptions } = require("../kadastr/helpers");
const { getCurrentDate } = require("../../utils/common");
const { fetchPersonWpLightData } = require("../wp/helpers");

const getPersonBySsnDb = async (req) => {
  const params = req.params;
  const bprUrl = process.env.BPR_URL;
  const { ssn } = params;
  await createLog({ req, fields: { ssn } });
  var queryData = qs.stringify({
    psn: ssn,
    addresses: "ALL",
  });

  var config = {
    method: "post",
    url: bprUrl,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: queryData,
  };

  const response = await axios(config);

  const { status, result } = response.data;

  if (status === "failed") {
    return [];
  }

  if (!result.length) return [];
  const person = result[0];

  const { AVVDocuments, AVVAddresses, ...restInfo } = person;
  const addresses = AVVAddresses?.AVVAddress || defaultAddress;
  const documents = AVVDocuments?.Document || defaultDocument;
  return { addresses, documents, ...restInfo };
};

const getSearchedPersonsDb = async (req) => {
  const body = req.body;
  const bprUrl = process.env.BPR_URL;

  const {
    firstName,
    lastName,
    patronomicName,
    birthDate,
    documentNumber,
    ssn,
  } = body;

  const searchData = {
    addresses: "ALL",
    ...(ssn && { psn: ssn }),
    ...(firstName && { first_name: firstName }),
    ...(lastName && { last_name: lastName }),
    ...(patronomicName && { middle_name: patronomicName }),
    ...(birthDate && { birth_date: birthDate }),
    ...(documentNumber && { docnum: documentNumber }),
  };

  var queryData = qs.stringify(searchData);

  await createLog({ req, fields: searchData });

  var config = {
    method: "post",
    url: bprUrl,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: queryData,
  };

  const response = await axios(config);

  const { status, result } = response.data;

  if (status === "failed") {
    return [];
  }

  const persons = result.map((person) => {
    const { AVVDocuments, AVVAddresses, ...restInfo } = person;

    const addresses = AVVAddresses?.AVVAddress || [];
    const documents = AVVDocuments?.Document || [];
    return { addresses, documents, ...restInfo };
  });

  return persons;
};

const getDocumentsBySsnDb = async (req) => {
  const qkagUrl = process.env.QKAG_URL;
  const { ssn } = req.params;
  const { firstName, lastName } = req.body;
  await createLog({ req, fields: { ssn } });

  var queryData = qs.stringify(
    {
      ssn,
      first_name: firstName,
      last_name: lastName,
    },
    { encode: true }
  );

  var config = {
    method: "post",
    url: qkagUrl,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: queryData,
  };

  const response = await axios(config);

  const { status, result } = response.data;

  const documents = Object.values(result);

  if (documents.length === 0) {
    return [];
  }

  return documents;
};

const getTaxBySsnDb = async (req) => {
  const { ssn } = req.params;
  await createLog({ req, fields: { ssn } });
  const taxUrl = process.env.TAX_URL;

  const { data } = await axios.post(`${taxUrl}`, { ssn });

  if (!data.taxPayersInfo) {
    return [];
  }

  const {
    taxPayersInfo: { taxPayerInfo },
  } = data;

  return taxPayerInfo;
};

const getRoadpoliceBySsnDb = async (req) => {
  const { ssn } = req.params;
  await createLog({ req, fields: { ssn } });
  // const licensesAxiosConfigs = getRoadPoliceRequestOptions(
  //   {
  //     key: "psn",
  //     value: ssn,
  //   },
  //   process.env.ROADPOLICE_URL_LICENSES_PATH
  // );
  // const { data: licenseData } = await axios(licensesAxiosConfigs);
  // const license = licenseData?.rp_get_vehicle_info_response?.rp_vehicles || null;

  const vehiclesAxiosConfigs = getRoadPoliceRequestOptions(
    {
      key: "psn",
      value: ssn,
    },
    process.env.ROADPOLICE_URL_VEHICLES_PATH
  );
  const { data } = await axios(vehiclesAxiosConfigs);
  const vehicles = data?.rp_get_vehicle_info_response?.rp_vehicles || null;

  return {
    // license,
    vehicles,
  };
};

const searchVehiclesDb = async (req) => {
  const { paramValue } = req.params;
  const { searchBase } = req.query;

  await createLog({ req, fields: { [searchBase]: paramValue } });

  const vehiclesAxiosConfigs = getRoadPoliceRequestOptions(
    {
      key: searchBase,
      value: paramValue,
    },
    process.env.ROADPOLICE_URL_VEHICLES_PATH
  );
  const { data } = await axios(vehiclesAxiosConfigs);
  const vehicles = data?.rp_get_vehicle_info_response?.rp_vehicles || null;

  return { vehicles };
};

const getPoliceByPnumDb = async (req) => {
  const policeUrl = process.env.POLICE_URL;
  const { pnum } = req.params;
  await createLog({ req, fields: { ssn: pnum } });

  const requestBody = {
    Dzev: 9,
    HAYR: "",
    BDATE: "",
    SSN: pnum,
    last_name: "",
    first_name: "",
    STUGOX: process.env.POLICE_REQUEST_STUGOX,
    User: process.env.POLICE_REQUEST_USER_NAME,
    USER_ID: process.env.POLICE_REQUEST_USER_ID,
    PASSWORD: process.env.POLICE_REQUEST_USER_PASSWORD,
  };
  const dataString = qs.stringify({ customer: JSON.stringify(requestBody) });
  const { data } = await axios.post(policeUrl, dataString, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!data?.INFO) {
    return "";
  }

  const { INFO, TAB } = data;

  return INFO;
};

const getCompanyByHvhhDb = async (req) => {
  const { hvhh } = req.params;
  await createLog({ req, fields: { hvhh } });
  const petregistrUrl = process.env.PETREGISTR_URL;

  const options = {
    jsonrpc: "2.0",
    id: 1,
    method: "company_info",
    params: { tax_id: hvhh },
  };

  const { data } = await axios.post(petregistrUrl, options);
  if (data?.error?.code === -32004) {
    throw new ApiError(404, "Նշված տվյալներով ոչինչ չի գտնվել։");
  }
  if (data?.error?.code === -32602) {
    throw new ApiError(503, "Սխալ որոնման պարամետրեր։");
  }
  if (!data.result || data.status === "failed") {
    throw new ApiError(503, "Կապի խափանում");
  }

  const {
    result: { company },
  } = data;

  return company;
};

const getPropertiesBySsnDb = async (req) => {
  const kadastrUrl = process.env.KADASTR_CERTIFICATE_URL;
  const { ssn } = req.params;
  await createLog({ req, fields: { ssn } });

  const axiosOptions = getCadastreRequestOptions("ssn", ssn);
  const { data } = await axios(axiosOptions);

  if (!data?.cad_get_realty_gip_response?.cad_get_realty) return [];
  return data.cad_get_realty_gip_response.cad_get_realty;
};

const getWpDataDB = async (req) => {
  const { pnum } = req.params;
  await createLog({ req, fields: { ssn: pnum } });

  const { data } = await fetchPersonWpLightData(pnum);
  return data;
};

module.exports = {
  getPersonBySsnDb,
  getSearchedPersonsDb,
  getDocumentsBySsnDb,
  getTaxBySsnDb,
  getCompanyByHvhhDb,
  getPoliceByPnumDb,
  getRoadpoliceBySsnDb,
  searchVehiclesDb,
  getPropertiesBySsnDb,
  getWpDataDB,
};
