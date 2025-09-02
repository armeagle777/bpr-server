const axios = require("axios");

const { getTaxRequestOptions } = require("./helpers");

const { createLog } = require("../log/services");
const { logTypesMap } = require("../../utils/constants");
const { getEkengRequestsEndDate } = require("../../utils/common");

const getTaxPayerGeneralInfoDB = async (taxId) => {
  try {
    const axiosOptions = getTaxRequestOptions(
      { tax_id: taxId },
      "get_general_info/v1"
    );
    const { data } = await axios(axiosOptions);
    return data?.tax_get_genereal_info_response &&
      !data?.tax_get_genereal_info_response.Error
      ? data?.tax_get_genereal_info_response
      : null;
  } catch (error) {
    console.log("Error getting TaxPayer General info: ", error);
    return null;
  }
};

const getTaxPayerLegalInfoDB = async (taxId) => {
  try {
    const axiosOptions = getTaxRequestOptions(
      { tax_id: taxId },
      "get_legal_tin_info/v1"
    );
    const { data } = await axios(axiosOptions);
    return data?.tax_get_legal_tin_info_response?.data ?? null;
  } catch (error) {
    console.log("Error getting TaxPayer Legal info: ", error);
    return null;
  }
};

const searchTaxPayerInfoDB = async (req, tax_id) => {
  try {
    const taxId = tax_id || req.params.taxId;
    await createLog({
      req,
      fields: { tax_id: taxId },
      LOG_TYPE_NAME: logTypesMap.taxPayerInfo.name,
    });

    const generalInfo = await getTaxPayerGeneralInfoDB(taxId);
    const legalInfo = await getTaxPayerLegalInfoDB(taxId);
    if (!generalInfo && !legalInfo) return null;
    return { generalInfo, legalInfo };
  } catch (error) {
    console.log("Error searching TaxPayer  info: ", error);
    return null;
  }
};

const searchPersonIncomeInfoDB = async (req) => {
  const ssn = req.params.ssn;
  const start_date = req.query.startDate || "1970-01-01";
  const end_date = req.query.endDate || getEkengRequestsEndDate();

  const ekengRequestProps = { ssn, start_date, end_date };

  await createLog({
    req,
    fields: ekengRequestProps,
    LOG_TYPE_NAME: logTypesMap.taxPersonIncomes.name,
  });

  const axiosOptions = getTaxRequestOptions(ekengRequestProps, "ssn/v1");
  const { data } = await axios(axiosOptions);
  return data?.tax_ssn_response?.taxPayerInfo || [];
};

module.exports = {
  searchTaxPayerInfoDB,
  getTaxPayerLegalInfoDB,
  getTaxPayerGeneralInfoDB,
  searchPersonIncomeInfoDB,
};
