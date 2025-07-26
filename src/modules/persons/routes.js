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
  ssnSanitizeMiddleware,
} = require("../../middlewares/ssnSanitizeMiddleware");
const {
  pnumSanitizeMiddleware,
} = require("../../middlewares/pnumSanitizeMiddleware");
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
  ssnSanitizeMiddleware,
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
  ssnSanitizeMiddleware,
  getTaxBySsn
);
personsRoute.get(
  "/:ssn/roadpolice",
  authMiddleware,
  rolesMiddleware([ROADPOLICE.uid, ADMIN.uid]),
  ssnSanitizeMiddleware,
  getRoadpoliceBySsn
);

personsRoute.get(
  "/:paramValue/vehicle",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, ROADPOLICE_FULL_SEARCH.uid]),
  searchVehicle
);

personsRoute.get(
  "/:pnum/police",
  authMiddleware,
  rolesMiddleware([POLICE.uid, ADMIN.uid]),
  pnumSanitizeMiddleware,
  getPoliceByPnum
);
personsRoute.post(
  "/:ssn/qkag",
  authMiddleware,
  rolesMiddleware([ZAQS.uid, ADMIN.uid]),
  ssnSanitizeMiddleware,
  getQkagInfoBySsn
);
personsRoute.get(
  "/:hvhh/petregistr",
  authMiddleware,
  rolesMiddleware([PETREGISTER.uid, ADMIN.uid]),
  getCompanyByHvhh
);

module.exports = personsRoute;
