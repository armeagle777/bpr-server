const { exportExcel } = require("./controller");
const { permissionsMap } = require("../../utils/constants");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");

const filesRouter = require("express").Router();
const { ADMIN } = permissionsMap;

filesRouter.post(
  "/excel/export/logs",
  authMiddleware,
  rolesMiddleware([ADMIN.uid]),
  exportExcel
);

module.exports = filesRouter;
