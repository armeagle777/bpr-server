const router = require("express").Router();
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const {
  getWpData,
  getWpCountries,
  filterWpPersons,
  getWpPersonFullInfo,
} = require("./controller");

const { ADMIN, WP, WP_PERSON_SEARCH } = permissionsMap;

router.get("/:pnum", rolesMiddleware([ADMIN.uid, WP.uid]), getWpData);
router.get("/countries/all", getWpCountries);
router.post(
  "/person/filter",
  rolesMiddleware([ADMIN.uid, WP_PERSON_SEARCH.uid]),
  filterWpPersons
);
router.post(
  "/person/:id/detail",
  rolesMiddleware([ADMIN.uid, WP_PERSON_SEARCH.uid]),
  getWpPersonFullInfo
);

module.exports = router;
