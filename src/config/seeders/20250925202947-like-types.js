"use strict";

const { likeTypesMap } = require("../../utils/constants");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all(
      Object.values(likeTypesMap)?.map(async (like) => {
        const likeTypeExists = await queryInterface.rawSelect(
          "LikeTypes",
          {
            where: {
              name: like.name,
            },
          },
          ["id"]
        );

        if (!likeTypeExists) {
          await queryInterface.bulkInsert("LikeTypes", [like], {});
        }
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("LikeTypes", null, {});
  },
};
