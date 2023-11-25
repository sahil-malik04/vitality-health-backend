const { verifyCookie } = require("../services/commonService");
const { failAction, successAction } = require("../utils/response");
const {
  getRolesUser,
  createRoleUser,
  updateRoleUser,
  deleteRoleUser,
} = require("../services/roleServices");

//function to get roles
exports.getRoles = async function (req, res) {
  try {
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getRolesUser(authData.emailOrUsername);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to create role
exports.createRole = async function (req, res) {
  try {
    const payload = req.body
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await createRoleUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to update role
exports.updateRole = async function (req, res) {
  try {
    const payload = req.body
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await updateRoleUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to delete role
exports.deleteRole = async function (req, res) {
  try {
    const paylaod = req.params;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await deleteRoleUser(authData.emailOrUsername, paylaod);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
