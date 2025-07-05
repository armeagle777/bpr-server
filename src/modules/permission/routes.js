const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const { getPermissions } = require("./controller");
const { BPR, ADMIN, TAX, ZAQS, POLICE, PETREGISTER } = permissionsMap;

router.get("/", rolesMiddleware([ADMIN.uid]), getPermissions);

module.exports = router;
