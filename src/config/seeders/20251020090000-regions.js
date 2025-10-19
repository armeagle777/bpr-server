"use strict";
const XLSX = require("xlsx");

module.exports = {
  async up(queryInterface, Sequelize) {
    const workbook = XLSX.readFile("src/utils/locations.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // Quick check: skip seeding if regions table already has rows
    const regionCountResult = await queryInterface.sequelize.query(
      "SELECT COUNT(*) AS cnt FROM regions;",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const regionCount = parseInt(regionCountResult[0].cnt, 10);
    if (regionCount > 0) {
      console.log("⏩ Seed skipped: regions already populated.");
      return;
    }

    // Build deduplicated arrays from Excel
    const regionMap = new Map(); // region_code -> { region_code, name }
    const communityMap = new Map(); // community_code -> { community_code, name, region_code }
    const settlements = []; // { settlement_code, name, community_code }

    for (const row of rows) {
      const RegionCode = row.RegionCode?.toString().trim();
      const RegionName = row.RegionName?.toString().trim();
      const CommunityCode = row.CommunityCode?.toString().trim();
      const CommunityName = row.CommunityName?.toString().trim();
      const SettlementCode = row.SettlementCode?.toString().trim();
      const SettlementName = row.SettlementName?.toString().trim();

      if (!RegionCode || !RegionName) continue;

      if (!regionMap.has(RegionCode)) {
        regionMap.set(RegionCode, {
          region_code: RegionCode,
          name: RegionName,
        });
      }

      if (CommunityCode && CommunityName && !communityMap.has(CommunityCode)) {
        communityMap.set(CommunityCode, {
          community_code: CommunityCode,
          name: CommunityName,
          region_code: RegionCode,
        });
      }

      if (SettlementCode && SettlementName) {
        settlements.push({
          settlement_code: SettlementCode,
          name: SettlementName,
          community_code: CommunityCode,
        });
      }
    }

    const t = await queryInterface.sequelize.transaction();
    try {
      // Insert regions
      const regionsArray = Array.from(regionMap.values());
      if (regionsArray.length > 0) {
        await queryInterface.bulkInsert("regions", regionsArray, {
          transaction: t,
        });
      }

      // Fetch inserted regions to map region_code -> id
      const dbRegions = await queryInterface.sequelize.query(
        "SELECT id, region_code FROM regions;",
        { type: Sequelize.QueryTypes.SELECT, transaction: t }
      );
      const regionIdMap = Object.fromEntries(
        dbRegions.map((r) => [r.region_code, r.id])
      );

      // Prepare communities with real region_id
      const communitiesArray = Array.from(communityMap.values()).map((c) => ({
        region_id: regionIdMap[c.region_code],
        community_code: c.community_code,
        name: c.name,
      }));
      if (communitiesArray.length > 0) {
        await queryInterface.bulkInsert("communities", communitiesArray, {
          transaction: t,
        });
      }

      // Fetch inserted communities to map community_code -> id
      const dbCommunities = await queryInterface.sequelize.query(
        "SELECT id, community_code FROM communities;",
        { type: Sequelize.QueryTypes.SELECT, transaction: t }
      );
      const communityIdMap = Object.fromEntries(
        dbCommunities.map((c) => [c.community_code, c.id])
      );

      // Prepare settlements with real community_id
      const settlementsArray = settlements
        .filter((s) => s.community_code && communityIdMap[s.community_code])
        .map((s) => ({
          community_id: communityIdMap[s.community_code],
          settlement_code: s.settlement_code,
          name: s.name,
        }));

      if (settlementsArray.length > 0) {
        await queryInterface.bulkInsert("settlements", settlementsArray, {
          transaction: t,
        });
      }

      await t.commit();
      console.log("✅ Locations seeded successfully.");
    } catch (err) {
      await t.rollback();
      console.error("❌ Seeding failed:", err);
      throw err;
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("settlements", null, {});
    await queryInterface.bulkDelete("communities", null, {});
    await queryInterface.bulkDelete("regions", null, {});
  },
};
