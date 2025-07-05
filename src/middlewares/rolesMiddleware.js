const ApiError = require("../exceptions/api-error");
const { validateAccessToken } = require("../utils/common");
const { ERROR_MESSAGES } = require("../utils/constants");

const rolesMiddleware = (allowedRolesArray) => {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers?.authorization?.split(" ")[1];
      if (!token) {
        throw ApiError.BadRequest(
          ERROR_MESSAGES.MIDDLEWARE_MESSAGES.NOT_AUTHORIZED
        );
      }
      const decodedData = validateAccessToken(token);
      if (!decodedData) {
        throw ApiError.BadRequest(
          ERROR_MESSAGES.MIDDLEWARE_MESSAGES.NOT_AUTHORIZED
        );
      }
      const { permissions } = decodedData;

      if (!permissions) {
        throw ApiError.BadRequest(
          ERROR_MESSAGES.MIDDLEWARE_MESSAGES.NO_USER_INFO
        );
      }
      let hasRole = false;
      allowedRolesArray?.forEach((role) => {
        if (permissions.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        throw ApiError.BadRequest(
          ERROR_MESSAGES.MIDDLEWARE_MESSAGES.HAS_NO_RIGHTS
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { rolesMiddleware };
