const { Log, LogType, User } = require("../../config/database");
const { getLogType } = require("./helpers");

const createLog = async ({ req, fields, LOG_TYPE_NAME, USER_ID }) => {
  try {
    const user = req?.user;
    const path = req?.path;
    const userId = USER_ID || user?.id;

    const logTypeName = LOG_TYPE_NAME || getLogType(path);

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

const filterLogsDB = async (req) => {
  const { page = 1, pageSize = 10, filters = {} } = req.body;

  const sanitizedFilters = Object.fromEntries(
    Object.entries(filters)?.filter(([_, v]) => Boolean(v))
  );
  const where = {};

  if (sanitizedFilters.user) {
    where.userId = sanitizedFilters.user.value;
  }

  if (sanitizedFilters.logType) {
    where.logTypeId = sanitizedFilters.logType.value;
  }
  const { count, rows } = await Log.findAndCountAll({
    where,
    include: [
      {
        model: LogType,
        attributes: ["id", "name"],
      },
      {
        model: User,
        attributes: ["id", "email", "firstName", "lastName"],
      },
    ],
    order: [["createdAt", "DESC"]],
    offset: (page - 1) * pageSize,
    limit: +pageSize,
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page: +page,
      pageSize: +pageSize,
      totalPages: Math.ceil(count / pageSize),
    },
  };
};

const filterLogsAllDataDB = async (filters = {}) => {
  const sanitizedFilters = Object.fromEntries(
    Object.entries(filters)?.filter(([_, v]) => Boolean(v))
  );
  const where = {};

  if (sanitizedFilters.user) {
    where.userId = sanitizedFilters.user.value;
  }

  if (sanitizedFilters.logType) {
    where.logTypeId = sanitizedFilters.logType.value;
  }
  const { rows } = await Log.findAndCountAll({
    where,
    include: [
      {
        model: LogType,
        attributes: ["id", "name"],
      },
      {
        model: User,
        attributes: ["id", "email", "firstName", "lastName"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return rows;
};

const getAllLogTypesDB = async (req) => {
  try {
    const logTypes = await LogType.findAll({});
    return logTypes;
  } catch (err) {
    return {
      error: err.message,
    };
  }
};

module.exports = {
  createLog,
  filterLogsDB,
  getAllLogTypesDB,
  filterLogsAllDataDB,
};
