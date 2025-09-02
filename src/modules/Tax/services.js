const axios = require("axios");

const { getTaxRequestOptions } = require("./helpers");

const { createLog } = require("../log/services");
const { logTypesMap } = require("../../utils/constants");

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

const searchTaxPayerInfoDB = async (req) => {
  try {
    const taxId = req.params.taxId;
    await createLog({
      req,
      fields: { tax_id: taxId },
      LOG_TYPE_NAME: logTypesMap.taxPayerInfo.name,
    });

    const generalInfo = await getTaxPayerGeneralInfoDB(taxId);
    const legalInfo = await getTaxPayerLegalInfoDB(taxId);

    return { generalInfo, legalInfo };
  } catch (error) {
    console.log("Error searching TaxPayer  info: ", error);
    return null;
  }
};

module.exports = {
  getTaxPayerGeneralInfoDB,
  getTaxPayerLegalInfoDB,
  searchTaxPayerInfoDB,
};
