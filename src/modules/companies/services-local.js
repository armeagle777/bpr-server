const axios = require('axios');

const ApiError = require('../../exceptions/api-error');

const getCompaniesBySsnDb = async (ssn) => {
    const taxUrl = process.env.PETREGISTR_PERSON_URL;

    const { data } = await axios.get(`${taxUrl}?fake_ssn=${ssn}`);

    if (data.length === 0) {
        return [];
    }

    const {
        result: { person },
    } = data[0];

    const { companies, ...rest } = { ...person };
    const result = { ...rest, companies: Object.values(companies) };

    return result;
};

module.exports = {
    getCompaniesBySsnDb,
};
