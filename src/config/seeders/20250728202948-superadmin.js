"use strict";

require("dotenv").config();
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Create Permission with uid=9999 if not exists
      const permissionUID = "9999";
      let permissionId = await queryInterface.rawSelect(
        "Permissions",
        { where: { uid: permissionUID }, transaction },
        ["id"]
      );

      if (!permissionId) {
        await queryInterface.bulkInsert(
          "Permissions",
          [
            {
              uid: permissionUID,
              name: "Ադմինիստրատոր",
              description: "Ադմինիստրատոր",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          { transaction }
        );

        permissionId = await queryInterface.rawSelect(
          "Permissions",
          { where: { uid: permissionUID }, transaction },
          ["id"]
        );
      }

      // 2. Create Role if not exists
      const roleName = "Administrator";

      let roleId = await queryInterface.rawSelect(
        "Roles",
        { where: { name: roleName }, transaction },
        ["id"]
      );

      if (!roleId) {
        await queryInterface.bulkInsert(
          "Roles",
          [
            {
              name: roleName,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          { transaction }
        );

        roleId = await queryInterface.rawSelect(
          "Roles",
          { where: { name: roleName }, transaction },
          ["id"]
        );
      }

      // 3. Associate permission to role (Permission_Roles)
      const rolePermissionExists = await queryInterface.rawSelect(
        "Permission_Roles",
        {
          where: {
            RoleId: roleId,
            PermissionId: permissionId,
          },
          transaction,
        },
        ["RoleId"]
      );

      if (!rolePermissionExists) {
        await queryInterface.bulkInsert(
          "Permission_Roles",
          [
            {
              RoleId: roleId,
              PermissionId: permissionId,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          { transaction }
        );
      }

      // 4. Create superadmin user
      const superAdminEmail = process.env.SUPER_ADMIN_USERNAME;
      const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

      if (!superAdminEmail || !superAdminPassword) {
        throw new Error(
          "SUPER_ADMIN_USERNAME or SUPER_ADMIN_PASSWORD is missing in .env"
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
    const superAdminEmail = process.env.SUPER_ADMIN_USERNAME;
    await queryInterface.bulkDelete("Users", { email: superAdminEmail });
    await queryInterface.bulkDelete("Permission_Roles", null, {});
    await queryInterface.bulkDelete("Roles", { name: "Administrator" });
    await queryInterface.bulkDelete("Permissions", { uid: "9999" });
  },
};
