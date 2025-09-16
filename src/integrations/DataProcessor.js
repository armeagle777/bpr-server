const { getPersonAVVDataDB } = require("../modules/AVV/services");
const { getTaxPayerGeneralInfoDB } = require("../modules/Tax/services");

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
      getPersonAVVData: getPersonAVVDataDB,
      getTaxPayerGeneralInfo: getTaxPayerGeneralInfoDB,
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
      persons: DataProcessor.getRandomItems(this.data.persons, limit),
      taxIds: DataProcessor.getRandomItems(this.data.taxIds, limit),
      pnums: DataProcessor.getRandomItems(this.data.pnums, limit),
    };
  }

  // Process random batch using services
  async processBatch() {
    const batch = this.getRandomBatch();

    const promises = [];

    //Push all Services with document number
    if (batch.docNums.length) {
      batch.docNums.map((doc) =>
        promises.push(this.services.getPersonAVVData({ docnum: doc }))
      );
    }

    //Push all services with fName, lName
    if (batch.persons.length) {
      batch.persons.map(({ f_name, l_name, m_name }) =>
        promises.push(
          this.services.getPersonAVVData({
            first_name: f_name,
            last_name: l_name,
          })
        )
      );
    }

    //Push all services with taxId
    if (batch.taxIds.length) {
      batch.taxIds.map((taxId) =>
        promises.push(this.services.getTaxPayerGeneralInfo(taxId))
      );
    }

    //Push all services with pnum
    if (batch.pnums.length) {
      batch.pnums.map((pnum) =>
        promises.push(this.services.getPersonAVVData({ psn: pnum }))
      );
    }

    return Promise.all(promises);
  }
}

module.exports = DataProcessor;
