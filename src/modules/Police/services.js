const axios = require("axios");

const { createLog } = require("../log/services");
const { getPoliceRequestOptions } = require("./helpers");
const { logTypesMap } = require("../../utils/constants");

const getWeaponsDataDB = async (req) => {
  const body = req.body;

  await createLog({
    req,
    fields: body,
    LOG_TYPE_NAME: logTypesMap.weapon.name,
  });

  const axiosOptions = getPoliceRequestOptions(body);
  const { data } = await axios(axiosOptions);

  if (!data?.get_weapon_info_response) return [];
  return data.get_weapon_info_response.data;
};

module.exports = {
  getWeaponsDataDB,
};
