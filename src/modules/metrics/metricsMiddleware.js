const {
  httpRequestCounter,
  httpRequestDuration,
  inflightRequests,
  requestSizeBytes,
} = require("./metrics");

function metricsMiddleware(req, res, next) {
  inflightRequests.inc();

  const route = req.route?.path || req.path || req.originalUrl || "unknown";
  const method = req.method;
  const end = httpRequestDuration.startTimer({ method, route });

  const contentLength = req.headers["content-length"];
  const size = parseInt(contentLength || "0", 10);
  requestSizeBytes.set({ method, route }, size);

  res.on("finish", () => {
    inflightRequests.dec();
    httpRequestCounter.inc({ method, route, status: res.statusCode });
    end({ method, route, status: res.statusCode });
  });

  next();
}

module.exports = metricsMiddleware;
