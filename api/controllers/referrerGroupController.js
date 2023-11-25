const { verifyCookie } = require("../services/commonService");
const { failAction, successAction } = require("../utils/response");
const {
  getReferrerGroupsUser,
  createReferrerGroupUser,
  updateReferrerGroupUser,
  deleteReferrerGroupUser,
  getReferrerGroupByIdUser,
  addReferrerInGroupUser,
  deleteReferrerFromGroupUser,
} = require("../services/referrerGroupService");

//function to get referrer-groups
exports.getReferrerGroups = async function (req, res) {
  try {
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getReferrerGroupsUser(authData.emailOrUsername);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to create referrer-group
exports.createReferrerGroup = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await createReferrerGroupUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to update referrer-group
exports.updateReferrerGroup = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await updateReferrerGroupUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to delete referrer-group
exports.deleteReferrerGroup = async function (req, res) {
  try {
    const payload = req.params;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await deleteReferrerGroupUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to get referrer-group by id
exports.getReferrerGroupById = async function (req, res) {
  try {
    const payload = req.params;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getReferrerGroupByIdUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to add referrer in group
exports.addReferrerInGroup = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await addReferrerInGroupUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to delete referrer from group
exports.deleteReferrerFromGroup = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await deleteReferrerFromGroupUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
