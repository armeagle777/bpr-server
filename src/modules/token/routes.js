const router = require('express').Router();
const { refreshToken } = require('./controller');

router.get('/refresh', refreshToken);

module.exports = router;
