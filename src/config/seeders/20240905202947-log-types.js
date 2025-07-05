"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const logTypeData = [
      {
        name: "Որոնում",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Այցելություն էջ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "PDF գեներացում",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Կադաստրի որոնում",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await Promise.all(
      logTypeData.map(async (log) => {
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
