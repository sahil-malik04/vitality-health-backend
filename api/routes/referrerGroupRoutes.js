const express = require("express");
const router = express.Router();
const {
  getReferrerGroups,
  createReferrerGroup,
  updateReferrerGroup,
  deleteReferrerGroup,
  getReferrerGroupById,
  addReferrerInGroup,
  deleteReferrerFromGroup,
} = require("../controllers/referrerGroupController");

router.get("/get-referrer-groups", getReferrerGroups);
router.post("/create-referrer-group", createReferrerGroup);
router.put("/update-referrer-group", updateReferrerGroup);
router.delete("/delete-referrer-group/:groupId", deleteReferrerGroup);
router.get("/get-referrer-group-by-id/:groupId", getReferrerGroupById);
router.put("/add-referrer-in-group", addReferrerInGroup);
router.delete("/delete-referrer-from-group", deleteReferrerFromGroup);

module.exports = router;
