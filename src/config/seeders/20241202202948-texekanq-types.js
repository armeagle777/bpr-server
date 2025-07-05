"use strict";

const { texekanqTypes } = require("../../utils/constants");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const texekanqTypesData = Object.values(texekanqTypes).map((name) => ({
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Promise.all(
      texekanqTypesData.map(async (type) => {
        const typeExists = await queryInterface.rawSelect(
          "Texekanqtypes",
          {
            where: {
              name: type.name,
            },
          },
          ["id"]
        );

        if (!typeExists) {
          await queryInterface.bulkInsert("Texekanqtypes", [type], {});
        }
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Permissions", null, {});
  },
};
