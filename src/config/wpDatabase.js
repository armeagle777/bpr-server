const { Sequelize } = require("sequelize");

const host = process.env.WP_DATABASE_HOST;
const DB = process.env.WP_DATABASE_NAME;
const username = process.env.WP_DATABASE_USERNAME;
const password = process.env.WP_DATABASE_PASSWORD;

const wpSequelize = new Sequelize(DB, username, password, {
  host: host,
  dialect: "mysql",
  logging: false,
});

wpSequelize.authenticate();

module.exports = { wpSequelize };
