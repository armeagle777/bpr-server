const router = require('express').Router();

const {getRequestIp} = require('./controller');

router.get('/get-ip',  getRequestIp);



module.exports = router;