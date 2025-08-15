const {
  loginDB,
  logoutDB,
  updateUserDB,
  checkEmailDB,
  getAllUsersDB,
  registrationDB,
  activationUserDB,
  toggleUserActiveDB,
  getAllUsersLightDB,
  changePwdDB,
} = require("./services");

const registration = async (req, res, next) => {
  try {
    const user = await registrationDB(req);
    res.cookie("refreshToken", user.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    });
    res.status(200).json(user);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await updateUserDB(req);
    res.status(200).json(user);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const user = await changePwdDB(req);
    res.status(200).json(user);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const toggleUserActive = async (req, res, next) => {
  try {
    const user = await toggleUserActiveDB(req);
    res.status(200).json(user);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const checkEmail = async (req, res, next) => {
  try {
    const email = await checkEmailDB(req);
    res.status(200).json(email);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await loginDB(email, password);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    });
    return res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await logoutDB(refreshToken);
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "logout success" });
  } catch (err) {
    next(err);
  }
};

const activate = async (req, res, next) => {
  try {
    await activationUserDB(req.params.link);
    return res.redirect(process.env.CLIENT_URL);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersDB();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getUsersLight = async (req, res, next) => {
  try {
    const users = await getAllUsersLightDB(req);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  logout,
  activate,
  getUsers,
  checkEmail,
  updateUser,
  registration,
  getUsersLight,
  changePassword,
  toggleUserActive,
};

// import { responseDataCreator, sendActivationKey } from '../../helpers/common.js'
// import { ERROR_MESSAGES } from '../../helpers/constants.js'
// import {
//   getAllUsersDB,
//   createUserDB,
//   getUserByIdDB,
//   updateUserDB,
//   deleteUserDB,
//   loginDB,
//   sendKeyDB,
//   verifyUserDB,
//   resetPasswordDB
// } from './db.js'

// export const getAllUsers = async ({ query, body }, res, next) => {
//   try {
//     const users = await getAllUsersDB(query)
//     res.status(200).json(responseDataCreator(users))
//   } catch (error) {
//     next(error)
//   }
// }

// export const getUserById = async (req, res, next) => {
//   try {
//     const { id } = req.params
//     const user = await getUserByIdDB(+id)

//     res.status(200).json(responseDataCreator(user))
//   } catch (error) {
//     next(error)
//   }
// }

// export const createUser = async (req, res, next) => {
//   try {
//     const user = await createUserDB(req.body)
//     res.status(200).json(responseDataCreator(user))
//   } catch (error) {
//     next(error)
//   }
// }

// export const updateUser = async (req, res, next) => {
//   const { id } = req.params
//   try {
//     const user = await updateUserDB(req.body, +id)
//     res.status(200).json(responseDataCreator(user))
//   } catch (error) {
//     next(error)
//   }
// }

// export const deleteUser = async (req, res, next) => {
//   try {
//     const { id } = req.params
//     const response = await deleteUserDB(+id)
//     res.status(200).json(responseDataCreator(response))
//   } catch (error) {
//     next(error)
//   }
// }

// export const login = async ({ body }, res, next) => {
//   try {
//     const user = await loginDB(body)
//     res.status(200).json(responseDataCreator(user))
//   } catch (error) {
//     next(error)
//   }
// }

// export const sendKey = async (req, res, next) => {
//   const { email } = req.body;

//   try {
//     const data = await sendKeyDB(email);
//     if (data.data) {
//       sendActivationKey(email, data.data.link);
//     }
//     res.status(200).json(responseDataCreator(data));
//   }
//   catch (error) {
//     next(error);
//   }
// }

// export const verifyUser = async (req, res, next) => {
//   const { id, token } = req.params;
//   try {
//     const data = await verifyUserDB(+id, token);
//     res.status(200).json(responseDataCreator(data));
//   }
//   catch (error) {
//     next(error);
//   }
// }

// export const resetPassword = async (req, res, next) => {
//   const { newPass, token } = req.body;
//   const { id } = req.params;
//   try {
//     const data = await resetPasswordDB(newPass, token, +id);
//     res.status(200).json(responseDataCreator(data));
//   }
//   catch (error) {
//     next(error);
//   }
// }
