const docNumService = require("./docNumService");
// const personService = require("./personService");
// const taxIdService = require("./taxIdService");
// const pnumService = require("./pnumService");

// import your data file (with 5000 entries each)
const initialData = require("../utils/data.json");

class DataProcessor {
  constructor() {
    this.data = {
      docNums: initialData.docNums || [],
      persons: initialData.persons || [],
      taxIds: initialData.taxIds || [],
      pnums: initialData.pnums || [],
    };

    this.services = {
      docNums: docNumService.processDocNums,
      //   persons: personService.processPersons,
      //   taxIds: taxIdService.processTaxIds,
      //   pnums: pnumService.processPnums
    };
  }

  // Utility: get N random unique items
  static getRandomItems(arr, n) {
    if (arr.length <= n) return arr;
    const result = [];
    const taken = new Set();

    while (result.length < n) {
      const idx = Math.floor(Math.random() * arr.length);
      if (!taken.has(idx)) {
        taken.add(idx);
        result.push(arr[idx]);
      }
    }
    return result;
  }

  getRandomBatch(limit = 20) {
    return {
      docNums: DataProcessor.getRandomItems(this.data.docNums, limit),
      //   persons: DataProcessor.getRandomItems(this.data.persons, limit),
      //   taxIds: DataProcessor.getRandomItems(this.data.taxIds, limit),
      //   pnums: DataProcessor.getRandomItems(this.data.pnums, limit)
    };
  }

  // Process random batch using services
  async processBatch() {
    const batch = this.getRandomBatch();

    const promises = [];

    if (batch.docNums.length) {
      promises.push(this.services.docNums(batch.docNums));
    }
    // if (batch.persons.length) {
    //   promises.push(this.services.persons(batch.persons));
    // }
    // if (batch.taxIds.length) {
    //   promises.push(this.services.taxIds(batch.taxIds));
    // }
    // if (batch.pnums.length) {
    //   promises.push(this.services.pnums(batch.pnums));
    // }

    return Promise.all(promises);
  }
}

module.exports = DataProcessor;
