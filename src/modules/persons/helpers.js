const qs = require("qs");
const { parse, differenceInYears } = require("date-fns");

const EkengIntegration = require("../../integrations/EkengIntegration");
const { defaultAddress, defaultDocument } = require("../../utils/constants");

const getBordercrossAxiosConfigs = ({ passportNumber, citizenship }) => {
  const axiosData = `<?xml version="1.0" encoding="UTF-8"?>\r\n <data>\r\n    <citizenship>${citizenship}</citizenship>\r\n    <passportNumber>${passportNumber}</passportNumber>\r\n </data>`;
  return {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.BORDERCROSS_EKENQ_URL,
    headers: {
      "Content-Type": "application/xml",
      Authorization: `Basic ${process.env.BORDERCROSS_EKENG_AUTHORIZATION}`,
      Cookie: process.env.BORDERCROSS_AXIOS_COOKIES,
    },
    data: axiosData,
  };
};

const getLicensesAxiosConfigs = (psn) => {
  const axiosBody = qs.stringify({
    psn,
  });

  return {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.ROADPOLICE_URL}/get_driving_license_with_info/v1`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: axiosBody,
  };
};

const getRoadPoliceRequestOptions = ({ key, value }, path) => {
  const url = `${process.env.ROADPOLICE_URL}/${path}`;
  const postData = {
    [key]: value,
  };

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(url, postData);

  return options;
};

const formatBprData = (data) => {
  const { AVVDocuments, AVVAddresses, ...restInfo } = data;
  const addresses = AVVAddresses?.AVVAddress || defaultAddress;
  const documents = AVVDocuments?.Document || defaultDocument;
  return { addresses, documents, ...restInfo };
};

const filterPersons = (data, filters) => {
  return data.filter((item) => {
    //Age Filtering
    const birthDate = item.documents.find((doc) => doc.Person.Birth_Date)
      ?.Person?.Birth_Date;
    const date = parse(birthDate, "dd/MM/yyyy", new Date());
    const age = differenceInYears(new Date(), date);
    const ageCheck =
      (filters.age.min === null || age >= filters.age.min) &&
      (filters.age.max === null || age <= filters.age.max);

    // Gender Filtering
    const sex = item.documents.find((doc) => doc.Person?.Genus)?.Person?.Genus;
    const genderCheck =
      (filters.gender?.trim() === "MALE" && sex?.trim() === "M") ||
      (filters.gender === "FEMALE" && sex === "F") ||
      filters.gender === "";

    let marzCheck = true;
    if (filters.marz != "") {
      marzCheck = Array.isArray(item.addresses)
        ? item.addresses.some(
            (addr) =>
              addr.RegistrationAddress &&
              addr.RegistrationAddress.Region === filters.marz
          )
        : false;
    }

    return ageCheck && genderCheck && marzCheck;
  });
};

module.exports = {
  formatBprData,
  filterPersons,
  getLicensesAxiosConfigs,
  getBordercrossAxiosConfigs,
  getRoadPoliceRequestOptions,
};
