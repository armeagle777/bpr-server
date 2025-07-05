const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);

const activateUserSchema = {
    params: Joi.object({
        link: Joi.string().required(),
    }),
};

const registerUserSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: joiPassword
            .string()
            .min(8)
            .max(12)
            .minOfSpecialCharacters(1)
            .minOfLowercase(1)
            .minOfUppercase(1)
            .minOfNumeric(1)
            .noWhiteSpaces()
            .required()
            .messages({
                'password.minOfUppercase':
                    '{#label} should contain at least {#min} uppercase character',
                'password.minOfSpecialCharacters':
                    '{#label} should contain at least {#min} special character',
                'password.minOfLowercase':
                    '{#label} should contain at least {#min} lowercase character',
                'password.minOfNumeric':
                    '{#label} should contain at least {#min} numeric character',
                'password.noWhiteSpaces':
                    '{#label} should not contain white spaces',
            }),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
    }),
};

const loginUserSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: joiPassword.string().required(),
    }),
};
// const createUserSchema = {
//     body: Joi.object({
//         firstName: Joi.string().min(2).required(),
//         lastName: Joi.string().min(2).required(),
//         email: Joi.string().email().required(),
//         password: joiPassword.string().min(4).required(),
//         phoneNumber: Joi.string()
//             .regex(/^\d{9}$/)
//             .messages({
//                 'string.pattern.base':
//                     JOI_VALIDATION_MESSAGES.PHONE_NUMBER_PATTERN,
//             }),
//         role: Joi.string().valid('ADMIN', 'EMPLOYEE', 'GUEST'),

//         isActive: Joi.boolean(),
//         lastLogin: Joi.date(),
//     }),
// };

// const updateUserByIdSchema = {
//     params: Joi.object({
//         id: Joi.number().integer().required(),
//     }),

//     body: Joi.object({
//         firstName: Joi.string().min(2).required(),
//         lastName: Joi.string().min(2).required(),
//         email: Joi.string().email().required(),
//         password: joiPassword.string().min(4).required(),
//         phoneNumber: Joi.string()
//             .regex(/^\d{9}$/)
//             .messages({
//                 'string.pattern.base':
//                     JOI_VALIDATION_MESSAGES.PHONE_NUMBER_PATTERN,
//             }),
//         isActive: Joi.boolean(),
//         lastLogin: Joi.date(),
//         role: Joi.string().valid('ADMIN', 'EMPLOYEE', 'GUEST'),
//     }),
// };

module.exports = { activateUserSchema, registerUserSchema, loginUserSchema };
