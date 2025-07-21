const pnumSanitizeMiddleware = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }
  let pnum = req.params?.pnum;
  // Replace '*' with '/' if it exists
  if (pnum?.includes("*")) {
    pnum = pnum.replace(/\*/g, "/");
  }

  // Optional: assign back if needed later in the route
  req.params.pnum = pnum;

  next();
};

module.exports = { pnumSanitizeMiddleware };
