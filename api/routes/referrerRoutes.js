const express = require("express");
const router = express.Router();
const {
  getReferrer,
  getReferrerForSelf,
  createReferrer,
  updateReferrer,
  deleteReferrer,
  updateReferrerStatus,
} = require("../controllers/referrerController");

router.get("/get-referrers", getReferrer);
router.get("/get-referrer-for-self", getReferrerForSelf);
router.post("/create-referrer", createReferrer);
router.put("/update-referrer", updateReferrer);
router.delete("/delete-referrer/:referrerId", deleteReferrer);
router.put("/update-referrer-status", updateReferrerStatus);

module.exports = router;
