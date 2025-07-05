const { insertDataFromFile, getSpheresDataDb } = require('./services');

const uploadExcel = async (req, res, next) => {
    try {
        const { files } = req;

        if (!files) {
            res.status(400).send({
                message: 'No file uploaded',
            });
        }

        const dataRows = await insertDataFromFile(files);

        res.status(200).json(dataRows);
    } catch (err) {
        console.log('err::::::', err);

        next(err);
    }
};

const getAllSpheres = async (req, res, next) => {
    try {
        const spheresData = await getSpheresDataDb();
        res.status(200).json(spheresData);
    } catch (error) {
        console.log('err::::::', err);

        next(err);
    }
};

module.exports = {
    uploadExcel,
    getAllSpheres,
};
