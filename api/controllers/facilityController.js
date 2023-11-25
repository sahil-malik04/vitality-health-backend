const { verifyCookie } = require("../services/commonService");
const { failAction, successAction } = require("../utils/response");

const {
  getFacilitiesUser,
  getFacilitiesForSelfUser,
  createFacilityUser,
  updateFacilityUser,
  deleteFacilityUser,
} = require("../services/facilityService");

// function to get facility
exports.getFacilities = async function (req, res) {
  try {
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getFacilitiesUser(authData.emailOrUsername);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to get facility for self
exports.getFacilitiesForSelf = async function (req, res) {
  try {
    const data = await getFacilitiesForSelfUser();
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to create facility
exports.createFacility = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await createFacilityUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to update facility
exports.updateFacility = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await updateFacilityUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to delete facility
exports.deleteFacility = async function (req, res) {
  try {
    const payload = req.params;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await deleteFacilityUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
