const { createLog, getAllLogTypesDB, filterLogsDB } = require("./services");
const { logTypesMap } = require("../../utils/constants");

const createLogHandler = async (req, res, next) => {
  try {
    const log = await createLog({
      req,
      fields: req.body,
      LOG_TYPE_NAME: logTypesMap.pdfDownload.name,
    });
  } catch (err) {
    console.log("Error crating Log:", err);
  }
};

const filterLogs = async (req, res, next) => {
  try {
    const logs = await filterLogsDB(req);
    res.status(200).json(logs);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const getLogTypes = async (req, res, next) => {
  try {
    const logTypes = await getAllLogTypesDB();
    res.status(200).json(logTypes);
  } catch (err) {
    next(err);
  }
};

module.exports = { createLogHandler, getLogTypes, filterLogs };
