const { getSocialPaymentsDataDB } = require("./services");

const getSocialPaymentsData = async (req, res, next) => {
  try {
    const paymentsData = await getSocialPaymentsDataDB(req);

    res.status(200).json(paymentsData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSocialPaymentsData,
};
