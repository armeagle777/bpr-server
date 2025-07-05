const express = require("express");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");

const {
  getPersonBySsn,
  getSearchedPersons,
  getQkagInfoBySsn,
  getTaxBySsn,
  getCompanyByHvhh,
  downloadBprInfo,
  getPoliceByPnum,
  getBordercrossBySsn,
  getRoadpoliceBySsn,
  searchVehicle,
  searchBordercrossData,
} = require("./controller");
const { permissionsMap } = require("../../utils/constants");
const {
  BPR,
  ADMIN,
  TAX,
  ZAQS,
  POLICE,
  PETREGISTER,
  BORDERCROSS,
  ROADPOLICE,
  ROADPOLICE_FULL_SEARCH,
} = permissionsMap;

const personsRoute = express.Router();

personsRoute.get(
  "/:ssn/bpr",
  authMiddleware,
  rolesMiddleware([BPR.uid, ADMIN.uid]),
  getPersonBySsn
);
personsRoute.post("/download", authMiddleware, downloadBprInfo);
personsRoute.post(
  "/bpr",
  authMiddleware,
  rolesMiddleware([BPR.uid, ADMIN.uid]),
  getSearchedPersons
);
personsRoute.get(
  "/:ssn/tax",
  authMiddleware,
  rolesMiddleware([TAX.uid, ADMIN.uid]),
  getTaxBySsn
);
personsRoute.get(
  "/:ssn/roadpolice",
  authMiddleware,
  rolesMiddleware([ROADPOLICE.uid, ADMIN.uid]),
  getRoadpoliceBySsn
);

personsRoute.get(
  "/:paramValue/vehicle",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, ROADPOLICE_FULL_SEARCH.uid]),
  searchVehicle
);

personsRoute.post(
  "/bordercross",
  authMiddleware,
  rolesMiddleware([BORDERCROSS.uid, ADMIN.uid]),
  getBordercrossBySsn
);

personsRoute.get(
  "/:pnum/police",
  authMiddleware,
  rolesMiddleware([POLICE.uid, ADMIN.uid]),
  getPoliceByPnum
);
personsRoute.post(
  "/:ssn/qkag",
  authMiddleware,
  rolesMiddleware([ZAQS.uid, ADMIN.uid]),
  getQkagInfoBySsn
);
personsRoute.get(
  "/:hvhh/petregistr",
  authMiddleware,
  rolesMiddleware([PETREGISTER.uid, ADMIN.uid]),
  getCompanyByHvhh
);

module.exports = personsRoute;
