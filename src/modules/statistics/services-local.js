const getAsylumTotalDb = async ({ year, period }) => {
  // const petregistrUrl = process.env.PETREGISTR_URL;
  // const options = {
  //   jsonrpc: "2.0",
  //   id: 1,
  //   method: "company_info",
  //   params: { tax_id: hvhh },
  // };
  // const { data } = await axios.post(petregistrUrl, options);
  // if (!data.result) {
  //   return [];
  // }
  // const {
  //   result: { company },
  // } = data;
  // return company;
  return [
    {
      key: "Ռուսաստան",
      country: "Ռուսաստան",
      applications: 332,
      shortened: 933,
      rejected: 1265,
      asylum: 139,
    },
    {
      key: "Ղազախստան",
      country: "Ղազախստան",
      applications: 2,
      shortened: 7,
      rejected: 9,
      asylum: 3,
    },
    {
      key: "Բելառուս",
      country: "Բելառուս",
      applications: 12,
      shortened: 11,
      rejected: 23,
      asylum: 6,
    },
  ];
};

const getAsylumApplicationsDb = async ({ year, period }) => {
  return [
    {
      key: "Ռուսաստան",
      country: "Ռուսաստան",
      applications: 332,
      shortened: 933,
      rejected: 1265,
      asylum: 139,
    },
    {
      key: "Ղազախստան",
      country: "Ղազախստան",
      applications: 2,
      shortened: 7,
      rejected: 9,
      asylum: 3,
    },
    {
      key: "Բելառուս",
      country: "Բելառուս",
      applications: 12,
      shortened: 11,
      rejected: 23,
      asylum: 6,
    },
  ];
};

const getAsylumDecisionsDb = async ({ year, period }) => {
  return [
    {
      key: "Ռուսաստան",
      country: "Ռուսաստան",
      applications: 332,
      shortened: 933,
      rejected: 1265,
      asylum: 139,
    },
    {
      key: "Ղազախստան",
      country: "Ղազախստան",
      applications: 2,
      shortened: 7,
      rejected: 9,
      asylum: 3,
    },
    {
      key: "Բելառուս",
      country: "Բելառուս",
      applications: 12,
      shortened: 11,
      rejected: 23,
      asylum: 6,
    },
  ];
};

module.exports = { getAsylumTotalDb };
