const { verifyCookie } = require("../services/commonService");
const { successAction, failAction } = require("../utils/response");
const {
  getSettingsUser,
  updateSettingsUser,
  getAvailableTimeSlotsUser,
  getAvailableTimeSlotsSelfUser,
} = require("../services/settingService");

// function to get settings
exports.getSettings = async function (req, res) {
  try {
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getSettingsUser(authData.emailOrUsername);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to update setting
exports.updateSettings = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await updateSettingsUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to get available time slots
exports.getAvailableTimeSlots = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getAvailableTimeSlotsUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to get available time slots self
exports.getAvailableTimeSlotsSelf = async function (req, res) {
  try {
    const payload = req.body;
    const data = await getAvailableTimeSlotsSelfUser(
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
