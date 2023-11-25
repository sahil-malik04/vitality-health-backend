const { verifyCookie } = require("../services/commonService");
const { failAction, successAction } = require("../utils/response");
const {
  getProceduresUser,
  getProceduresForSelfUser,
  createProcedureUser,
  updateProcedureUser,
  deleteProcedureUser,
} = require("../services/procedureService");

//function to get procedures
exports.getProcedures = async function (req, res) {
  try {
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getProceduresUser(authData.emailOrUsername);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to get procedures for self
exports.getProceduresForSelf = async function (req, res) {
  try {
    const data = await getProceduresForSelfUser();
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to create procedure
exports.createProcedures = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await createProcedureUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to update procedure
exports.updateProcedure = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await updateProcedureUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to delete procedure
exports.deleteProcedure = async function (req, res) {
  try {
    const payload = req.params;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await deleteProcedureUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
