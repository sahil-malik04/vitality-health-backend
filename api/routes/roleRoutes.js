const express = require("express");
const router = express.Router();
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");

router.get("/get-roles", getRoles);
router.post("/create-role", createRole);
router.put("/update-role", updateRole);
router.delete("/delete-role/:roleId", deleteRole);

module.exports = router;
