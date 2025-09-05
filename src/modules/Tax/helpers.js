const EkengIntegration = require("../../integrations/EkengIntegration");

const getTaxRequestOptions = (body, path) => {
  const taxUrl = `${process.env.TAX_API_URL}/${path}`;

  const ekeng = new EkengIntegration();
  const options = ekeng.buildRequestOptions(taxUrl, body);

  return options;
};

const mapActivePropToEmployees = (activeEmployees, allEmployees) => {
  if (!allEmployees?.length) return null;
  activeEmployees?.forEach((activeEmployee) => {
    const employee = allEmployees?.find(
      (emp) => emp.personalinfo?.ssn === activeEmployee.personalinfo?.ssn
    );
    if (employee) employee.isActiveEmployee = true;
  });

  return allEmployees;
};

module.exports = { getTaxRequestOptions, mapActivePropToEmployees };
