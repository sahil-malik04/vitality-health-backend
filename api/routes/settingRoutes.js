const express = require("express");
const {
  getSettings,
  updateSettings,
  getAvailableTimeSlots,
  getAvailableTimeSlotsSelf,
} = require("../controllers/settingController");
const router = express.Router();

router.get("/get-settings", getSettings);
router.put("/update-setting", updateSettings);
router.post("/get-available-time-slots", getAvailableTimeSlots);
router.post("/get-available-time-slots-self", getAvailableTimeSlotsSelf);

module.exports = router;
