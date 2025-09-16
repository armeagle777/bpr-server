const cron = require("node-cron");
const DataProcessor = require("./DataProcessor");
const { DATA_PROCESSOR_CRON_SCHEDULE } = require("../utils/constants");

class CronService {
  constructor() {
    this.processor = new DataProcessor();
  }

  start() {
    cron.schedule(DATA_PROCESSOR_CRON_SCHEDULE, async () => {
      console.log("⏰ Running hourly random batch...");
      try {
        await this.processor.processBatch();
        console.log("✅ Batch processed");
      } catch (err) {
        console.error("❌ Error in batch processing:", err);
      }
    });
  }
}

module.exports = CronService;
