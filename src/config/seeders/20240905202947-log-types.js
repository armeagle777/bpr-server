"use strict";

const { logTypesMap } = require("../../utils/constants");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all(
      logTypesMap.map(async (log) => {
        const logTypeExists = await queryInterface.rawSelect(
          "LogTypes",
          {
            where: {
              name: log.name,
            },
          },
          ["id"]
        );

        if (!logTypeExists) {
          await queryInterface.bulkInsert("LogTypes", [log], {});
        }
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("LogTypes", null, {});
  },
};
