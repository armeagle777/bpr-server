const { Log, LogType } = require("../../config/database");
const { getLogType } = require("./helpers");

const createLog = async ({ req, fields, LOG_TYPE_NAME }) => {
  try {
    const { user, path } = req;
    const { id: userId } = user;
    const logTypeName = LOG_TYPE_NAME ?? getLogType(path);
    const logType = await LogType.findOne({
      where: { name: logTypeName },
    });
    const newLog = await Log.create({
      userId,
      fields,
      logTypeId: logType.id,
    });
    return newLog;
  } catch (error) {
    console.log("Error creating Log:", error);
    return null;
  }
};

module.exports = {
  createLog,
};
