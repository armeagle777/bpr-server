const { getWeaponsDataDB, searchPersonsByImageDB } = require('./services');

const getWeaponsData = async (req, res, next) => {
    try {
        const weaponse = await getWeaponsDataDB(req);

        res.status(200).json(weaponse);
    } catch (err) {
        next(err);
    }
};

const searchPersonsByImage = async (req, res, next) => {
    try {
        const persons = await searchPersonsByImageDB(req);

        res.status(200).json(persons);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getWeaponsData,
    searchPersonsByImage,
};
