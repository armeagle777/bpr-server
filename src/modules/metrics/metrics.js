const client = require("prom-client");

// Create a registry to register the metrics
const register = new client.Registry();

// Collect default metrics (Node.js process, memory, CPU, etc.)
client.collectDefaultMetrics({
  register,
  prefix: "nodejs_",
});

// HTTP Request Counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// Request Duration Histogram
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5],
});

// In-flight Requests Gauge
const inflightRequests = new client.Gauge({
  name: "inflight_requests",
  help: "Number of in-flight (active) requests",
});

// Approximate Request Size
const requestSizeBytes = new client.Gauge({
  name: "http_request_size_bytes",
  help: "Approximate size of HTTP request in bytes",
  labelNames: ["method", "route"],
});

// Register all metrics
register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);
register.registerMetric(inflightRequests);
register.registerMetric(requestSizeBytes);

module.exports = {
  register,
  httpRequestCounter,
  httpRequestDuration,
  inflightRequests,
  requestSizeBytes,
};
