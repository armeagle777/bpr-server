"use strict";

require("dotenv").config();
const bcrypt = require("bcrypt");
const { rolesMap } = require("../../utils/constants"); // Make sure ADMIN is inside rolesMap

const { ADMIN } = rolesMap;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Insert ADMIN role if not exists
      let roleId = await queryInterface.rawSelect(
        "Roles",
        {
          where: { uid: ADMIN.uid },
          transaction,
        },
        ["id"]
      );

      if (!roleId) {
        roleId = await queryInterface.bulkInsert(
          "Roles",
          [
            {
              uid: ADMIN.uid,
              name: ADMIN.name,
              description: ADMIN.description,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          { transaction }
        );

        // If `bulkInsert` doesn’t return ID, query it again
        roleId =
          roleId ||
          (await queryInterface.rawSelect(
            "Roles",
            { where: { uid: ADMIN.uid }, transaction },
            ["id"]
          ));
      }

      // Insert superadmin user
      const superAdminEmail = process.env.SUPER_ADMIN_USERNAME;
      const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

      if (!superAdminEmail || !superAdminPassword) {
        throw new Error(
          "SUPER_ADMIN_USERNAME or SUPER_ADMIN_PASSWORD is missing from .env"
        );
      }

      const userExists = await queryInterface.rawSelect(
        "Users",
        {
          where: { email: superAdminEmail },
          transaction,
        },
        ["id"]
      );

      if (!userExists) {
        const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

        await queryInterface.bulkInsert(
          "Users",
          [
            {
              email: superAdminEmail,
              password: hashedPassword,
              firstName: "Super",
              lastName: "Admin",
              pashton: "Ադմին",
              isActivated: true,
              activationLink: null,
              phoneNumber: "+374XXXXXXXX",
              roleId,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          { transaction }
        );
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const email = process.env.SUPER_ADMIN_USERNAME;
    await queryInterface.bulkDelete("Users", { email });
    await queryInterface.bulkDelete("Roles", { uid: ADMIN.uid });
  },
};
