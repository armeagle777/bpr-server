const icRoute = require('express').Router();
const { authMiddleware } = require('../../middlewares/authMiddleware');
const { rolesMiddleware } = require('../../middlewares/rolesMiddleware');
const { permissionsMap } = require('../../utils/constants');
const { getWeaponsData } = require('./controller');

const { WEAPON, ADMIN, SEARCH_PERSON_BY_IMAGE } = permissionsMap;

icRoute.post(
    '/weapons',
    authMiddleware,
    rolesMiddleware([ADMIN.uid, WEAPON.uid]),
    getWeaponsData
);

icRoute.post(
    '/persons/by-image',
    authMiddleware,
    rolesMiddleware([ADMIN.uid, SEARCH_PERSON_BY_IMAGE.uid]),
    getWeaponsData
);

module.exports = icRoute;
