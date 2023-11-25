const { verifyCookie } = require("../services/commonService");
const { failAction, successAction } = require("../utils/response");
const {
  getEmployeesUser,
  createEmployeeUser,
  updateEmployeeUser,
  deleteEmployeeUser,
  updateEmployeeStatusUser,
} = require("../services/employeeService");

// function to get employees
exports.getEmployees = async function (req, res) {
  try {
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getEmployeesUser(authData.emailOrUsername);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to create employee
exports.createEmployee = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await createEmployeeUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to update employee
exports.updateEmployee = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await updateEmployeeUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to delete employee
exports.deleteEmployee = async function (req, res) {
  try {
    const payload = req.params;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await deleteEmployeeUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to update employee-status
exports.updateEmployeeStatus = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await updateEmployeeStatusUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
