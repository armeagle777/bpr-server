const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const {
  getWpCountries,
  filterWpPersons,
  getWpPersonFullInfo,
} = require("./controller");

const { ADMIN, WP_PERSON_SEARCH } = permissionsMap;

router.get("/countries/all", getWpCountries);
router.post(
  "/filter/wp-data",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, WP_PERSON_SEARCH.uid]),
  filterWpPersons
);
router.post(
  "/person/:id/wp-data",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, WP_PERSON_SEARCH.uid]),
  getWpPersonFullInfo
);

module.exports = router;
