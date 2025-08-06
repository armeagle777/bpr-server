const router = require("express").Router();

const { getPermissions } = require("./controller");
const { permissionsMap } = require("../../utils/constants");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");

const { BPR, ADMIN, TAX, ZAQS, POLICE, PETREGISTER } = permissionsMap;

router.get("/", rolesMiddleware([ADMIN.uid]), getPermissions);

module.exports = router;
