const express = require('express');

const { uploadExcel, getAllSpheres } = require('./controller');

const sphereRoute = express.Router();

sphereRoute.post('/upload', uploadExcel);
sphereRoute.get('/', getAllSpheres);

module.exports = sphereRoute;
