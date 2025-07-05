const { Sequelize, DataTypes } = require("sequelize");

const host = process.env.DATABASE_HOST;
const DB = process.env.SAHMANAHATUM_DATABASE_NAME;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;

const sahmanahatumSequelize = new Sequelize(DB, username, password, {
  host: host,
  dialect: "mysql",
  logging: false,
});

const Cross = sahmanahatumSequelize.define(
  "cross",
  {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    cross_type: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    cross_point: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    in_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    out_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: "TIMESTAMP",
      defaultValue: sahmanahatumSequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    updatedAt: {
      type: "TIMESTAMP",
      defaultValue: sahmanahatumSequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["cross_point", "year", "month", "cross_type", "country"],
      },
    ],
  }
);

sahmanahatumSequelize.authenticate();

module.exports = {
  sahmanahatumSequelize,
  Cross,
};
