const axios = require("axios");

const { createLog } = require("../log/services");
const { getRoadPoliceRequestOptions } = require("./helpers");
const { logTypesMap } = require("../../utils/constants");
const { vehicleBlockInfoParamsMap } = require("./constants");

const getTransactionsDataDB = async (req) => {
  const psn = req.params.psn;

  await createLog({
    req,
    fields: { psn },
    LOG_TYPE_NAME: logTypesMap.roadPoliceTransactions.name,
  });

  const axiosOptions = getRoadPoliceRequestOptions(
    { psn },
    "get_owner_changes_info/v1"
  );
  const { data } = await axios(axiosOptions);

  if (
    data?.get_owner_changes_info_response?.status !== "ok" ||
    !data.get_owner_changes_info_response?.result?.length
  )
    return [];
  return data.get_owner_changes_info_response.result[0];
};

const getViolationsDataDB = async (req) => {
  const psn = req.params.psn;

  await createLog({
    req,
    fields: { psn },
    LOG_TYPE_NAME: logTypesMap.roadPoliceViolations.name,
  });

  const axiosOptions = getRoadPoliceRequestOptions(
    { psn },
    "get_violations/v1"
  );

  const { data } = await axios(axiosOptions);

  return data?.rp_get_violations_response?.rp_violations || [];
};

const getVehicleBlockInfoDB = async (searchProps) => {
  // Ensure `searchProps` is an object
  if (!searchProps || typeof searchProps !== "object") {
    console.error("searchProps must be an object.");
    return null;
  }

  // Get all keys of searchProps
  const keys = Object.keys(searchProps);

  // Ensure there is exactly one key
  if (keys.length !== 1) {
    console.error("searchProps must contain exactly one search parameter.");
    return null;
  }

  const [key] = keys;

  // Validate that the key is in the map
  if (!vehicleBlockInfoParamsMap[key]) {
    console.error(
      `Invalid search parameter "${key}". Allowed keys: ${Object.keys(
        vehicleBlockInfoParamsMap
      ).join(", ")}`
    );
    return null;
  }

  const axiosOptions = getRoadPoliceRequestOptions(
    searchProps,
    "get_vehicle_block_info/v1"
  );

  const { data } = await axios(axiosOptions);

  return !!data?.get_vehicle_block_info_response?.result?.length
    ? data.get_vehicle_block_info_response.result
    : null;
};

const searchDrivingLicenseDB = async (licenseNumber) => {
  // const { body } = req;

  // const sanitizedProps = Object.fromEntries(
  //   Object.entries(body)?.filter(([_, v]) => Boolean(v))
  // );

  // await createLog({
  //   req,
  //   fields: sanitizedProps,
  //   LOG_TYPE_NAME: logTypesMap.roadPolice.name,
  // });

  const axiosOptions = getRoadPoliceRequestOptions(
    { rp_license_reg_num: licenseNumber },
    "get_driving_license/v1"
  );

  const { data } = await axios(axiosOptions);

  return data?.rp_get_driving_license_response
    ? [data.rp_get_driving_license_response]
    : [];
};

module.exports = {
  getViolationsDataDB,
  getTransactionsDataDB,
  getVehicleBlockInfoDB,
  searchDrivingLicenseDB,
};
