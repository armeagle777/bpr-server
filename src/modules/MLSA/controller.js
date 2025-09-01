const { getSocialPaymentsDataDB } = require("./services");

const getSocialPaymentsData = async (req, res, next) => {
  try {
    const ssn = req.params.ssn;
    const paymentsData = await getSocialPaymentsDataDB(ssn);

    res.status(200).json(paymentsData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSocialPaymentsData,
};
