const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const {
  getAsylumFullData,
  getAsylumCountries,
  filterAsylumLightData,
} = require("./controller");

const { ADMIN, ASYLUM } = permissionsMap;

router.get("/countries/all", getAsylumCountries);
router.post(
  "/filter/asylum-data",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, ASYLUM.uid]),
  filterAsylumLightData
);
router.get(
  "/person/:id/asylum-data",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, ASYLUM.uid]),
  getAsylumFullData
);

module.exports = router;
