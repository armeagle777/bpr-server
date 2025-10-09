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

  const axiosOptions = getICRequestOptions(
    sanitizedProps,
    "get_weapon_info/v1"
  );
  const { data } = await axios(axiosOptions);
  if (!data?.get_weapon_info_response) return [];
  return data.get_weapon_info_response.data;
};

const searchPersonsByImageDB = async (req) => {
  const body = req.body;
  const { imageBase64 } = body;
  const searchProps = {
    imageBase64,
    requesterpsn: "",
  };

  await createLog({
    req,
    fields: searchProps,
    LOG_TYPE_NAME: logTypesMap.imageSearch.name,
  });

  const axiosOptions = getICRequestOptions(
    searchProps,
    "face_recongition_find/v1"
  );
  const { data } = await axios(axiosOptions);
  return data?.face_recognition_find_response?.persons || [];
};

module.exports = {
  getWeaponsDataDB,
  searchPersonsByImageDB,
};
