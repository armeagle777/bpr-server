"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const logTypeData = [
      {
        name: "ԲՊՌ Որոնում",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ՊԵԿ Որոնում",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ՔԿԱԳ Որոնում",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Պետական Ռեգիստրի Որոնում",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Կադաստրի Որոնում",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Որոնվողների Բազայում Որոնում",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Աշխ. Թույլտվության Բազայում Որոնում",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ՃՈ Որոնում",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Փախստականների Բազայում Որոնում",
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
