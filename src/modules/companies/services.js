const axios = require('axios');

const ApiError = require('../../exceptions/api-error');

const getCompaniesBySsnDb = async (ssn) => {
    const taxUrl = process.env.PETREGISTR_URL;

    const body = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'person_info',
        params: { ssn },
    });
    var config = {
        method: 'post',
        url: taxUrl,
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    };
    const { data } = await axios(config);

    if (data.error) {
        return [];
    }
    const {
        result: { person },
    } = data;

    const { companies, ...rest } = { ...person };
    const result = { ...rest, companies: Object.values(companies) };

    return result;
};

module.exports = {
    getCompaniesBySsnDb,
};
