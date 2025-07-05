const texekanqUidPrefix = "QV";

const templatesMap = {
  1: "cityzenship_report",
  2: "pnum_report",
  3: "passports_report",
};

const reportTitleLetterMap = {
  1: "Ք",
  2: "ՀԾՀ",
  3: "Անձ",
  4: "Հաշ",
};

const permissionTexekanqMap = { 10003: 2, 10002: 3, 10001: 1 };

module.exports = {
  permissionTexekanqMap,
  texekanqUidPrefix,
  templatesMap,
  reportTitleLetterMap,
};
