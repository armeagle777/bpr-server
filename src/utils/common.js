const jwt = require("jsonwebtoken");
// const ApiError = require('../exceptions/api-error');

const generateTokens = async (payload) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};

const createUserData = (userObject) => {
  return {
    id: userObject.id,
    email: userObject.email,
    pashton: userObject.pashton,
    firstName: userObject.firstName,
    lastName: userObject.lastName,
    isActivated: userObject.isActivated,
    Role: userObject.Role.name,
    permissions: userObject.Role.Permissions.map((p) => p.uid),
  };
};

const validateRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};

const validateAccessToken = (accessToken) => {
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

// const validateSchema = (schema) => {
//     if (typeof schema !== 'object' || schema === null)
//         throw new Error(JOI_VALIDATION_MESSAGES.SCHEMA_OBJECT);

//     return async (req, res, next) => {
//         const { params, body } = req;

//         try {
//             schema.params && (await schema.params.validateAsync(params));
//             schema.body && (await schema.body.validateAsync(body));
//             return next();
//         } catch (error) {
//             next(ApiError.BadRequest(error.message));
//         }
//     };
// };

function getCurrentDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

const getEkengRequestsEndDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

module.exports = {
  createUserData,
  generateTokens,
  getCurrentDate,
  validateRefreshToken,
  validateAccessToken,
  getEkengRequestsEndDate,
};
