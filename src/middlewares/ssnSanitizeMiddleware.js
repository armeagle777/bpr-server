const ssnSanitizeMiddleware = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }
  let ssn = req.params?.ssn;
  // Replace '*' with '/' if it exists
  if (ssn?.includes("*")) {
    ssn = ssn.replace(/\*/g, "/");
  }

  // Optional: assign back if needed later in the route
  req.params.ssn = ssn;

  next();
};

module.exports = { ssnSanitizeMiddleware };
