const express = require("express");

const {
  getPropertyByCertificate,
  getOptionsRegions,
  getOptionsCommunities,
} = require("./controller");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { permissionsMap } = require("../../utils/constants");
const { ADMIN, KADASTR_CERTIFICATE } = permissionsMap;

const kadastrRoutes = express.Router();

kadastrRoutes.get(
  "/:certificateNumber/document",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, KADASTR_CERTIFICATE.uid]),
  getPropertyByCertificate
);

kadastrRoutes.get("/options/regions", authMiddleware, getOptionsRegions);
kadastrRoutes.get(
  "/options/communities",
  authMiddleware,
  getOptionsCommunities
);

module.exports = kadastrRoutes;
