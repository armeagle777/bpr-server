const uuid = require("uuid");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const ApiError = require("../../exceptions/api-error");
const { saveTokenDB, deleteTokenDB } = require("../token/services");
const {
  createUserData,
  generateTokens,
  sendActivationMail,
  validateRefreshToken,
} = require("../../utils/common");
const { User, Role, Permission } = require("../../config/sphereDatabase");

const registrationDB = async (body) => {
  const { firstName, lastName, email, pashton, password, role, phoneNumber } =
    body;

  const candidate = await User.findOne({
    where: {
      email: email,
    },
  });
  if (candidate) {
    throw ApiError.BadRequest("User already exists");
  }

  const hashedPassword = await bcrypt.hash(body.password, 7);
  const activationLink = uuid.v4();
  const foundRole = await Role.findByPk(parseInt(role, 10));

  if (!foundRole) {
    throw ApiError.BadRequest("Role not found");
  }
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    pashton,
    phoneNumber,
    RoleId: foundRole.id,
    password: hashedPassword,
    activationLink,
  });

  const createdUserWithRole = await User.findByPk(newUser.id, {
    include: [
      {
        model: Role,
        attributes: ["id", "name"],
        include: [
          {
            model: Permission,
            attributes: ["id", "name"],
          },
        ],
      },
    ],
  });

  // await sendActivationMail(body.email, activationLink);
  const userData = createUserData(createdUserWithRole);
  const tokens = await generateTokens(userData);
  const tokenData = await saveTokenDB(userData.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userData,
  };
};

const toggleUserActiveDB = async (req) => {
  const { params, body } = req;
  const { id } = params;

  if (id != body.id) {
    throw ApiError.BadRequest("Incorrect data");
  }

  const user = await User.findByPk(+id, {
    attributes: {
      exclude: ["password", "activationLink"],
    },
  });

  if (!user) {
    throw ApiError.BadRequest("User doesn't exists");
  }

  const isActivated = !user.isActivated;

  if (!isActivated) {
    await deleteTokenDB(user.id);
  }

  const updatedUser = await user.update({ isActivated });

  return updatedUser;
};

const updateUserDB = async (req) => {
  const { params, body } = req;
  const { id } = params;
  delete body.Role;

  if (id != body.id) {
    throw ApiError.BadRequest("Incorrect data");
  }
  const dublicateUser = await User.findOne({
    where: {
      email: body.email,
      id: {
        [Op.not]: +id,
      },
    },
  });

  if (dublicateUser) {
    throw ApiError.BadRequest("User with this email already exists");
  }

  const user = await User.findByPk(+id);

  if (!user) {
    throw ApiError.BadRequest("User doesn't exists");
  }

  if (body.password) {
    const hashedPassword = await bcrypt.hash(body.password, 7);
    body.password = hashedPassword;
  } else {
    delete body.password;
  }

  const updatedCandidate = await user.update(body);

  return updatedCandidate;
};

const changePwdDB = async (req) => {
  const { params, body, user: logedInUser } = req;
  const { id } = params;
  const { password, newPassword } = body;

  if (id != logedInUser.id || !password || !newPassword) {
    throw ApiError.BadRequest("Incorrect data");
  }

  const user = await User.findByPk(+id);

  if (!user) {
    throw ApiError.BadRequest("User doesn't exists");
  }

  const isPassEqual = await bcrypt.compare(password, user.password);
  if (!isPassEqual) {
    throw ApiError.BadRequest("Գաղտնաբառը սխալ է");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 7);

  const updatedCandidate = await user.update({ password: hashedPassword });

  return updatedCandidate;
};

const loginDB = async (email, password) => {
  const candidate = await User.findOne({
    where: {
      email,
    },
    include: [
      {
        model: Role,
        attributes: ["id", "name"],
        include: [
          {
            model: Permission,
            attributes: ["id", "name", "uid"],
          },
        ],
      },
    ],
  });

  if (!candidate) {
    throw ApiError.BadRequest("User not found");
  }

  if (!candidate.isActivated) {
    throw ApiError.BadRequest("Ձեր լիազորությունները կասեցված են");
  }

  const isPassEqual = await bcrypt.compare(password, candidate.password);
  if (!isPassEqual) {
    throw ApiError.BadRequest("Incorrect password");
  }
  const userData = createUserData(candidate);
  const tokens = await generateTokens(userData);
  await saveTokenDB(userData.id, tokens.refreshToken);
  return { ...tokens, userData };
};

const logoutDB = async (refreshToken) => {
  const userInfo = await validateRefreshToken(refreshToken);

  const deletedToken = await deleteTokenDB(userInfo.id);
  return deletedToken;
};

const getAllUsersDB = async () => {
  try {
    const allUsers = await User.findAll({
      attributes: {
        exclude: ["password", "activationLink", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
        },
      ],
    });
    return { users: allUsers };
  } catch (err) {
    return {
      error: err.message,
    };
  }
};

const getAllUsersLightDB = async (req) => {
  try {
    const { user } = req;
    const allUsers = await User.findAll({
      where: { isActivated: true, id: { [Op.ne]: user.id } },
      attributes: {
        exclude: [
          "password",
          "activationLink",
          "createdAt",
          "updatedAt",
          "phoneNumber",
          "isActivated",
        ],
      },
    });
    return { users: allUsers };
  } catch (err) {
    return {
      error: err.message,
    };
  }
};

const checkEmailDB = async (req) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw ApiError.BadRequest("Email field is empty");
    }
    const dublicateUser = await User.findOne({
      where: {
        email,
      },
    });
    if (dublicateUser) return { isValid: false };
    return { isValid: true };
  } catch (err) {
    return {
      error: err.message,
    };
  }
};

const activationUserDB = async (link) => {
  try {
    const updatedUser = await user.update({
      where: {
        activationLink: link,
      },
      data: {
        isActivated: true,
      },
    });
    return updatedUser;
  } catch (err) {
    throw ApiError.BadRequest("Incorrect activation link");
  }
};

module.exports = {
  loginDB,
  logoutDB,
  changePwdDB,
  updateUserDB,
  checkEmailDB,
  getAllUsersDB,
  registrationDB,
  activationUserDB,
  toggleUserActiveDB,
  getAllUsersLightDB,
};
// import { prisma } from '../../services/Prisma.js'
// import bcrypt from 'bcryptjs'
// import { exclude, generateAccessToken, sendActivationKey } from "../../helpers/common.js"
// import { ERROR_MESSAGES } from "../../helpers/constants.js";
// import jwt from 'jsonwebtoken'

// const { user } = prisma

// const searchHandler = (contains) => {
//   return contains?.split(' ').map(search => {
//     return ['firstName', 'lastName', 'email', 'phoneNumber'].map(el => {
//       return {
//         [el]: {
//           contains: search
//         }
//       }
//     })
//   }).flat()
// }

// export const getAllUsersDB = async (query) => {
//   if (query.isActive === 'true') {
//     query.isActive = true
//   } else if (query.isActive === 'false') {
//     query.isActive = false
//   } else {
//     query.isActive = undefined
//   }
//   const { page, limit, sortBy, contains = '', isActive } = query
//   const handleSortBy = {
//     'name [A-Z]': {
//       firstName: 'asc',
//     },

//     'name [Z-A]': {
//       firstName: 'desc',
//     },

//     'created date (new to old)': {
//       createdAt: 'desc',
//     },

//     'created date (old to new)': {
//       createdAt: 'asc',
//     },

//     'updated date (new to old)': {
//       updatedAt: 'desc',
//     },

//     'updated date (new to old)': {
//       updatedAt: 'asc',
//     },
//   }

//   try {
//     const countAfterSearch = await user.count({
//       where: {
//         isActive: query.isActive,
//         OR: searchHandler(contains),
//       },
//     })

//     const usersCount = await user.count()

//     const usersPerPage = await user.findMany({
//       where: {
//         isActive: query.isActive,
//         OR: searchHandler(contains),
//       },

//       skip: (+page - 1) * +limit || undefined,
//       take: +limit || undefined,
//       orderBy: handleSortBy[sortBy] || undefined,

//       include: {
//         exhibitsCreated: true,
//         exhibitsUpdated: true,
//       },
//     })

//     return {
//       data: {
//         usersPerPage,
//         count: usersCount,
//         countAfterSearch,
//       },
//       error: null,
//     }
//   } catch (error) {
//     return {
//       data: null,
//       error,
//     }
//   }
// }

// export const getUserByIdDB = async (id) => {
//   try {
//     const userData = await user.findUnique({
//       where: {
//         id,
//       },
//       include: {
//         exhibitsCreated: true,
//         exhibitsUpdated: true,
//       },
//     })

//     // const {isActive} = userData;

//     if (userData) {
//       const userPassExcluded = exclude(userData, ['password'])
//       const { id, role } = userPassExcluded
//       const token = generateAccessToken(id, role)
//       return {
//         data: { ...userPassExcluded, token },
//         error: null,
//       }
//     } else {
//       return {
//         data: 'no such User',
//         error: null,
//       }
//     }
//   } catch (error) {
//     return {
//       data: null,
//       error,
//     }
//   }
// }

// export const updateUserDB = async (data, id) => {

//   try {
//     if (data.password) {
//       data.password = bcrypt.hashSync(data.password, 7)
//     }

//     const newData = await user.update({
//       where: {
//         id,
//       },
//       data,
//     })

//     const { password, ...userInfo } = newData

//     return {
//       data: userInfo,
//       error: null,
//     }
//   } catch (error) {
//     return {
//       data: null,
//       error,
//     }
//   }
// }

// export const deleteUserDB = async (id) => {
//   try {
//     await user.update({
//       where: {
//         id,
//       },
//       data: {
//         isActive: false,
//       },
//     })
//     return {
//       message: 'user deleted',
//       error: null,
//     }
//   } catch (error) {
//     return {
//       data: null,
//       error,
//     }
//   }
// }

// export const createUserDB = async (userData) => {
//   const { password, ...restData } = userData;
//   try {
//     const hashedPassword = bcrypt.hashSync(password, 7);

//     const newUser = await user.create({
//       data: {
//         password: hashedPassword,
//         ...restData
//       },
//       include: {
//         exhibitsCreated: true,
//         exhibitsUpdated: true
//       }
//     })

//     const { password: newUserPass, ...userInfo } = newUser

//     const token = generateAccessToken(userInfo.id, userInfo.role)

//     return {
//       data: { ...userInfo, token },
//       error: null,
//     }
//   } catch (error) {
//     return {
//       data: null,
//       error,
//     }
//   }
// }

// export const loginDB = async (userData) => {
//   const { email, password } = userData
//   try {
//     const candidate = await user.findUnique({
//       where: {
//         email,
//       },
//       include: {
//         exhibitsCreated: true,
//         exhibitsUpdated: true
//       },
//     })

//     if (!candidate) {
//       return {
//         data: null,
//         error: { message: "No user found with such email" }
//       }
//     }

//     const validPassword = bcrypt.compareSync(password, candidate.password)

//     if (!validPassword) {
//       return {
//         data: null,
//         error: { message: 'Password incorrect' },
//       }
//     }
//     const { password: createdUserPass, ...userInfo } = candidate
//     const token = generateAccessToken(userInfo.id, userInfo.role)
//     return {
//       data: { ...userInfo, token },
//       error: null,
//     }
//   } catch (error) {
//     return {
//       data: null,
//       error,
//     }
//   }
// }

// export const sendKeyDB = async (email) => {

//   try {
//     const foundUser = await user.findUnique({
//       where: {
//         email
//       }
//     })

//     if (!foundUser) {
//       return {
//         data: null,
//         error: { message: ERROR_MESSAGES.NO_USER_FOUND }
//       }
//     }
//     const token = generateAccessToken(foundUser.id, foundUser.role);
//     const link = `http://localhost:3000/reset-password/${foundUser.id}/${token}`;

//     return {
//       data: { link },
//       error: null
//     }
//   }
//   catch (error) {
//     return {
//       data: null,
//       error
//     }
//   }

// }

// export const verifyUserDB = async (id, token) => {
//   try {
//     const foundUser = await user.findUnique({
//       where: {
//         id
//       }
//     })

//     const decodedData = jwt.verify(token, process.env.TOKEN_SECRET)

//     if (foundUser && decodedData.id === id) {
//       return
//     }
//     return {
//       data: null,
//       error: { message: 'user is not verified' }
//     }
//   }

//   catch (error) {
//     console.log(error);
//     return {
//       data: null,
//       error
//     }
//   }
// }

// export const resetPasswordDB = async (newPass, userToken, id) => {
//   try {
//     const verified = await verifyUserDB(id, userToken);
//     if (verified?.error) {
//       return {
//         data: null,
//         error: { message: ERROR_MESSAGES.NOT_VERIFIED }
//       }
//     }
//     const foundUser = await user.findUnique({
//       where: {
//         id
//       }
//     });
//     const validPassword = bcrypt.compareSync(newPass, foundUser.password)
//     if (validPassword) {
//       return {
//         data: null,
//         error: { message: ERROR_MESSAGES.SAME_PASSWORD }
//       }
//     }

//     const hashedPassword = bcrypt.hashSync(newPass, 7)
//     const updatedUser = await user.update({
//       where: {
//         id
//       },
//       data: {
//         password: hashedPassword
//       }
//     })
//     const token = generateAccessToken(updatedUser.role, updatedUser.id);

//     return {
//       data: { ...updatedUser, token },
//       error: null
//     }
//   }

//   catch (error) {
//     console.log("error", error);
//     return {
//       data: null,
//       error
//     }
//   }

// }
