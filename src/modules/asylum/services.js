const {
  fetchAsylumCountriesData,
  fetchAsylumPersonsFilterData,
  fetchAsylumPersonFullData,
} = require("./helpers");

const { createLog } = require("../log/services");
const { logTypesMap } = require("../../utils/constants");

const getAsylumFilterOptionsDB = async () => {
  const { data } = await fetchAsylumCountriesData();
  return data;
};

const filterAsylumLightDataDB = async (req) => {
  const { page = 1, pageSize = 10, filters = {} } = req.body;
  const sanitizedFilters = Object.fromEntries(
    Object.entries(filters)?.filter(([_, v]) => Boolean(v))
  );
  const createLogFields = {
    filters: { ...sanitizedFilters },
    pagination: { page, pageSize },
  };

  await createLog({
    req,
    fields: createLogFields,
    LOG_TYPE_NAME: logTypesMap.asylum.name,
  });

  const response = await fetchAsylumPersonsFilterData({
    filters: sanitizedFilters,
    page,
    pageSize,
  });
  return response?.data;
};

const getAsylumFullDataDB = async (req) => {
  const { id: personalId } = req.params;
  await createLog({
    req,
    fields: { personalId },
    LOG_TYPE_NAME: logTypesMap.asylum.name,
  });
  const response = await fetchAsylumPersonFullData(personalId);
  return response?.data;
};

module.exports = {
  getAsylumFilterOptionsDB,
  filterAsylumLightDataDB,
  getAsylumFullDataDB,
};
