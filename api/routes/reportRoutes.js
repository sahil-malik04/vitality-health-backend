const express = require("express");
const router = express.Router();
const {
  getReports,
  createReport,
  updateReport,
  deleteReport,
  getReportsByAppointmentId,
} = require("../controllers/reportController");

router.get("/get-reports", getReports);
router.post("/create-report", createReport);
router.put("/update-report", updateReport);
router.delete("/delete-report/:reportId", deleteReport);
router.get(
  "/get-reports-by-appointment-id/:appointmentId",
  getReportsByAppointmentId
);

module.exports = router;
