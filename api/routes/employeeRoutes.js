const express = require("express");
const router = express.Router();
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeeStatus,
} = require("../controllers/employeeController");

router.get("/get-employees", getEmployees);
router.post("/create-employee", createEmployee);
router.put("/update-employee", updateEmployee);
router.delete("/delete-employee/:employeeId", deleteEmployee);
router.put("/update-employee-status", updateEmployeeStatus);

module.exports = router;
