const { logTypesMap } = require("../../utils/constants");

const getLogType = (path) => {
  const pathArray = path.split("/");

  const majorPath = pathArray[pathArray.length - 1];
  switch (majorPath) {
    case "bpr":
      return logTypesMap.bpr.name;
    case "petregistr":
      return logTypesMap.petRegister.name;
    case "document":
      return logTypesMap.cadaster.name;
    case "tax":
      return logTypesMap.tax.name;
    case "qkag":
      return logTypesMap.qkag.name;
    case "police":
      return logTypesMap.police.name;
    case "wp":
    case "wp-data":
      return logTypesMap.wp.name;
    case "roadpolice":
    case "vehicle":
      return logTypesMap.roadPolice.name;
    default:
      return "";
  }
};

module.exports = { getLogType };
