const mcsRoute = require("express").Router();

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const {
  getCommunities,
  getResidences,
  getStreets,
  searchPersons,
} = require("./controller");

const { BPR, ADMIN } = permissionsMap;

mcsRoute.get(
  "/options/communities",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, BPR.uid]),
  getCommunities
);

mcsRoute.get(
  "/options/residences",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, BPR.uid]),
  getResidences
);

mcsRoute.get(
  "/options/streets",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, BPR.uid]),
  getStreets
);

mcsRoute.post(
  "/persons/search",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, BPR.uid]),
  searchPersons
);

module.exports = mcsRoute;
