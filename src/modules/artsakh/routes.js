const router = require("express").Router();
const {
  pnumSanitizeMiddleware,
} = require("../../middlewares/pnumSanitizeMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const { getDisplacementData } = require("./controller");

const { ADMIN, ARTSAKH } = permissionsMap;

router.get(
  "/displacements/:pnum",
  rolesMiddleware([ADMIN.uid, ARTSAKH.uid]),
  pnumSanitizeMiddleware,
  getDisplacementData
);

module.exports = router;
