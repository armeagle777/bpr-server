const { fetchArtsakhDisplacements } = require("./helpers");

const getDisplacementDataDB = async (req) => {
  const { pnum } = req.params;
  const cases = await fetchArtsakhDisplacements();

  const certificates = await fetchArtsakhDisplacements();

  return {
    cases,
    certificates,
  };
};

module.exports = {
  getDisplacementDataDB,
};
