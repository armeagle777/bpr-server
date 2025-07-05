const { Op, Sequelize } = require("sequelize");

const { artsakhSequelize } = require("../../config/artsakhDatabase");
const {
  getDisplacementCasesQuery,
  getDisplacementCertsQuery,
} = require("./helpers");

const getDisplacementDataDB = async (req) => {
  const { pnum } = req.params;
  const cases = await artsakhSequelize.query(getDisplacementCasesQuery(pnum), {
    type: Sequelize.QueryTypes.SELECT,
  });

  const certificates = await artsakhSequelize.query(
    getDisplacementCertsQuery(pnum),
    {
      type: Sequelize.QueryTypes.SELECT,
    }
  );

  return {
    cases,
    certificates,
  };
};

module.exports = {
  getDisplacementDataDB,
};
