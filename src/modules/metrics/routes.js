const express = require("express");
const metricsRoute = express.Router();

const { register } = require("./metrics");

metricsRoute.get("/", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

module.exports = metricsRoute;
