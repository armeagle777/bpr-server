const { Op, Sequelize } = require("sequelize");

const {
  getWpQuery,
  getEatmQuery,
  getEatmFamilyMemberQuery,
  extractData,
  filterWpPersonsQuery,
  getFullInfoBaseQuery,
  getFinesQuery,
  formatBaseResult,
  getClaimsQuery,
  getCardsQuery,
  getFamilyMemberQuery,
} = require("./helpers");
const { wpSequelize } = require("../../config/wpDatabase");
const { TABLE_NAMES } = require("./constants");

const getWpDataDB = async (req) => {
  const { pnum } = req.params;

  const wpResponse = await wpSequelize.query(getWpQuery(pnum), {
    type: Sequelize.QueryTypes.SELECT,
  });

  const eatmResponse = await wpSequelize.query(getEatmQuery(pnum), {
    type: Sequelize.QueryTypes.SELECT,
  });

  const eatmFamilyResponse = await wpSequelize.query(
    getEatmFamilyMemberQuery(pnum),
    {
      type: Sequelize.QueryTypes.SELECT,
    }
  );
  const { cards: wpCards, data: wpData } = extractData(wpResponse);
  const { cards: eatmCards, data: eatmData } = extractData(eatmResponse);
  const { cards: eatmFamilyCards, data: eatmFamilyData } =
    extractData(eatmFamilyResponse);

  return {
    wpData,
    eatmData,
    eatmFamilyData,
    cards: [...wpCards, ...eatmCards, ...eatmFamilyCards],
  };
};

const getCountriesDB = async () => {
  const query = "SELECT * FROM countries";

  const countries = await wpSequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });

  return countries;
};

const filterWpPersonsDB = async (body) => {
  const { page = 1, pageSize = 10, filters } = body;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const countSubQuery = filterWpPersonsQuery(filters);
  const query = `${countSubQuery} LIMIT :limit OFFSET :offset`;

  // Get total count of records
  const countResult = await wpSequelize.query(countSubQuery, {
    type: Sequelize.QueryTypes.SELECT,
  });
  const total = countResult?.length || 0;

  // Get paginated records
  const persons = await wpSequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: { limit, offset },
  });

  // Calculate total pages
  const totalPages = Math.ceil(total / pageSize);

  // Return pagination response
  const response = {
    data: persons,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };

  return response;
};

const getWpPersonFullInfoDB = async (req) => {
  const { tablename: procedure, user_id } = req.body;
  const { id: emp_id } = req.params;

  const queries = [
    { key: "baseInfo", query: getFullInfoBaseQuery(procedure, emp_id) }, //for tab 1
    { key: "fines", query: getFinesQuery(procedure, emp_id) }, //for tab 4
    { key: "claims", query: getClaimsQuery(procedure, emp_id) }, // for tab 2
    { key: "cards", query: getCardsQuery(procedure, emp_id) }, // for tab 3
    ...(procedure === TABLE_NAMES.EAEU
      ? [
          {
            key: "familyMembers",
            query: getFamilyMemberQuery(procedure, user_id),
          },
        ]
      : []), // conditional for tab 5
  ];
  console.log("queries>>>>>", queries);
  const resultsArray = await Promise.all(
    queries.map((q) =>
      wpSequelize.query(q.query, { type: Sequelize.QueryTypes.SELECT })
    )
  );

  const results = {};
  queries.forEach((q, i) => {
    results[q.key] =
      q.key === "baseInfo"
        ? formatBaseResult(resultsArray[i])
        : resultsArray[i];
  });
  return results;
};

module.exports = {
  getWpDataDB,
  getCountriesDB,
  filterWpPersonsDB,
  getWpPersonFullInfoDB,
};
