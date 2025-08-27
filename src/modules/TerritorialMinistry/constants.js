const serviceTypesMap = {
  VEHICLES: "vehicles",
  REAL_ESTATE: "real_estate",
};

const personTypesMap = {
  PHYSICAL: "physical",
  LEGAL: "legal",
};

const identKeysMap = {
  physical: "psn",
  legal: "tax_id",
};

module.exports = { serviceTypesMap, personTypesMap, identKeysMap };
