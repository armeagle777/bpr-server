const axios = require('axios');

const { createLog } = require('../log/services');
const { getICRequestOptions } = require('./helpers');
const { logTypesMap } = require('../../utils/constants');

const getWeaponsDataDB = async (req) => {
    const body = req.body;
    const sanitizedProps = Object.fromEntries(
        Object.entries(body).filter(([_, value]) => Boolean(value))
    );
    await createLog({
        req,
        fields: sanitizedProps,
        LOG_TYPE_NAME: logTypesMap.weapon.name,
    });

    const axiosOptions = getICRequestOptions(sanitizedProps);
    const { data } = await axios(axiosOptions);
    if (!data?.get_weapon_info_response) return [];
    return data.get_weapon_info_response.data;
};

const searchPersonsByImageDB = async (req) => {
    const body = req.body;
    const { imageBase64 } = body;
    const searchProps = { imageBase64 };

    await createLog({
        req,
        fields: searchProps,
        LOG_TYPE_NAME: logTypesMap.imageSearch.name,
    });

    const axiosOptions = getICRequestOptions(searchProps);
    const { data } = await axios(axiosOptions);
    const personsLightData = data?.face_recognition_find_response?.persons;
    if (!personsLightData?.length) return [];

    const personsFullDataPromises = await Promise.allSettled(
        personsLightData.map(({ person }) =>
            getPersonAVVDataDB({ psn: person?.psn })
        )
    );

    const personsFullData = personsFullDataPromises
        .filter(({ status }) => status === 'fulfilled')
        .map(({ value }) => value[0])
        .filter(Boolean);

    if (!personsFullData.length) return [];

    const formattedPersons = personsFullData.map((person) =>
        formatBprData(person)
    );

    return formattedPersons;
};

module.exports = {
    getWeaponsDataDB,
    searchPersonsByImageDB,
};
