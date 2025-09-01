const axios = require("axios");

const { createLog } = require("../log/services");
const { getICRequestOptions } = require("./helpers");
const { logTypesMap } = require("../../utils/constants");

const getWeaponsDataDB = async (req) => {
  const body = req.body;
  const sanitizedProps = Object.fromEntries(
    Object.entries(body).filter(([_, value]) => Boolean(value))
  );
  await createLog({
    req,
    fields: sanitizedProps,
    LOG_TYPE_NAME: logTypesMap.weapon.name,
  });

  const axiosOptions = getICRequestOptions(sanitizedProps);
  const { data } = await axios(axiosOptions);
  if (!data?.get_weapon_info_response) return [];
  return data.get_weapon_info_response.data;
};

module.exports = {
  getWeaponsDataDB,
};
