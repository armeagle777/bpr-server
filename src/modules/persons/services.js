const axios = require("axios");
const qs = require("qs");
const fs = require("fs");
const crypto = require("crypto");
const https = require("https");
const { defaultAddress, defaultDocument } = require("../../utils/constants");

const ApiError = require("../../exceptions/api-error");
const { createLog } = require("../log/services");
const {
  getLicensesAxiosConfigs,
  getVehiclesAxiosConfigs,
  searchVehiclesAxiosConfigs,
  extractData,
  fetchWpData,
} = require("./helpers");
const { getCurrentDate } = require("../../utils/common");

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
  const licensesAxiosConfigs = getLicensesAxiosConfigs(ssn);
  const licensesResponse = await axios.request(licensesAxiosConfigs);
  const license = licensesResponse?.data?.result || null;

  const vehiclesAxiosConfigs = getVehiclesAxiosConfigs(ssn);
  const vehiclesResponse = await axios.request(vehiclesAxiosConfigs);
  const vehicles = vehiclesResponse?.data?.result?.length
    ? vehiclesResponse?.data?.result
    : null;

  return { license, vehicles };
};

const searchVehiclesDb = async (req) => {
  const { paramValue } = req.params;
  const { searchBase } = req.query;

  await createLog({ req, fields: { [searchBase]: paramValue } });

  const vehiclesAxiosConfigs = searchVehiclesAxiosConfigs(
    searchBase,
    paramValue
  );
  const vehiclesResponse = await axios.request(vehiclesAxiosConfigs);
  const vehicles = vehiclesResponse?.data?.result?.length
    ? vehiclesResponse?.data?.result
    : null;

  return { vehicles };
};

const getPoliceByPnumDb = async (req) => {
  const policeUrl = process.env.POLICE_URL;
  const { pnum } = req.params;
  await createLog({ req, fields: { ssn: pnum } });

  const requestBody = {
    first_name: "",
    last_name: "",
    HAYR: "",
    BDATE: "",
    SSN: pnum,
    Dzev: 9,
    USER_ID: "MQC_S",
    PASSWORD: "mqc123",
    User: "MQC_S",
    STUGOX: "EKG",
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
  const kadastrUrl = process.env.KADASTR_URL;
  const { ssn } = req.params;
  await createLog({ req, fields: { ssn } });

  const privateKey = fs.readFileSync("./src/ekeng-request.key", "utf8");
  const certificate = fs.readFileSync("./src/ekeng-request.pem", "utf8");

  const postData = JSON.stringify({
    ssn,
    date_from: "01/01/1970",
    date_to: getCurrentDate(),
  });

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(postData);
  sign.end();
  const signature = sign.sign(privateKey, "base64");

  const agent = new https.Agent({
    key: privateKey,
    cert: certificate,
    rejectUnauthorized: false,
  });

  const options = {
    method: "post",
    url: kadastrUrl,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
      "X-Signature-Algorithm": "RSA-SHA256",
      "X-Signature": signature,
    },
    data: postData,
    httpsAgent: agent,
  };
  const { data } = await axios(options);
  if (!data?.cad_get_realty_owned_response?.owned_realties) return [];

  return data.cad_get_realty_owned_response.owned_realties;
};

const getWpDataDB = async (req) => {
  const { pnum } = req.params;
  await createLog({ req, fields: { ssn: pnum } });

  const wpResponse = await fetchWpData(pnum);
  const eatmResponse = await fetchWpData(pnum);
  const eatmFamilyResponse = await fetchWpData(pnum);

  const { cards: wpCards, data: wpData } = extractData(wpResponse);
  const { cards: eatmCards, data: eatmData } = extractData(eatmResponse);
  const { cards: eatmFamilyCards, data: eatmFamilyData } =
    extractData(eatmFamilyResponse);

  return {
    wpData,
    eatmData,
    eatmFamilyData,
    cards: [...wpCards, ...eatmCards, ...eatmFamilyCards],
  };
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
