const { createLog } = require("./services");
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

module.exports = { createLogHandler };
