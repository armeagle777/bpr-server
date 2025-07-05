"use strict";

const { permissionsMap } = require("../../utils/constants");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissionsData = Object.values(permissionsMap).map((role) => ({
      ...role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Promise.all(
      permissionsData.map(async (permission) => {
        const permissionExists = await queryInterface.rawSelect(
          "Permissions",
          {
            where: {
              uid: permission.uid,
            },
          },
          ["id"]
        );

        if (!permissionExists) {
          await queryInterface.bulkInsert("Permissions", [permission], {});
        }
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Permissions", null, {});
  },
};
