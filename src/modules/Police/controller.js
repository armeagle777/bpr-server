const { getPropertyByCertificateDb } = require("./services");

const getPropertyByCertificate = async (req, res, next) => {
  try {
    const property = await getPropertyByCertificateDb(req);

    res.status(200).json(property);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPropertyByCertificate,
};
