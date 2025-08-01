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
    default:
      return "Այցելություն էջ";
  }
};

module.exports = { getLogType };
