const router = require("express").Router();

const { permissionsMap } = require("../../utils/constants");
const { createRole, getRoles, updateRole } = require("./controller");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");

const { BPR, ADMIN, TAX, ZAQS, POLICE, PETREGISTER } = permissionsMap;

router.post("/", rolesMiddleware([ADMIN.uid]), createRole);

router.put("/:id", rolesMiddleware([ADMIN.uid]), updateRole);

router.get("/", rolesMiddleware([ADMIN.uid]), getRoles);

module.exports = router;
