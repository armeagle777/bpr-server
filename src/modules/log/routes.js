const { authMiddleware } = require("../../middlewares/authMiddleware");
const { createLogHandler } = require("./controller");

const logsRoute = require("express").Router();

logsRoute.post("/", authMiddleware, createLogHandler);

module.exports = logsRoute;
