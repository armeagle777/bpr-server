const { Sequelize } = require("sequelize");

const host = process.env.DATABASE_HOST;
const DB = process.env.ARTSAKH_DATABASE_NAME;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;

const artsakhSequelize = new Sequelize(DB, username, password, {
  host: host,
  dialect: "mysql",
  logging: false,
});

artsakhSequelize.authenticate();

module.exports = { artsakhSequelize };
