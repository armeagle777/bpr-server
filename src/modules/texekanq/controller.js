const {
  createTexekanqDb,
  getTexekanqsDB,
  getFileBase64DB,
  getTexekanqTypesDB,
} = require("./services");

const createTexekanq = async (req, res, next) => {
  try {
    const texekanq = await createTexekanqDb(req);
    res.status(200).json(texekanq);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const getTexekanqTypes = async (req, res, next) => {
  try {
    const texekanqs = await getTexekanqTypesDB(req);
    res.status(200).json(texekanqs);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const getTexekanqs = async (req, res, next) => {
  try {
    const texekanqs = await getTexekanqsDB(req);
    res.status(200).json(texekanqs);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const getFileBase64 = async (req, res, next) => {
  try {
    const { fileName } = req.params;
    const response = await getFileBase64DB(fileName);
    res.status(200).json(response);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

module.exports = {
  createTexekanq,
  getTexekanqs,
  getFileBase64,
  getTexekanqTypes,
};
