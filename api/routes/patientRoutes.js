const express = require("express");
const router = express.Router();
const {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
  updatePatientStatus,
} = require("../controllers/patientController");

router.get("/get-patients", getPatients);
router.post("/create-patient", createPatient);
router.put("/update-patient", updatePatient);
router.delete("/delete-patient/:patientId", deletePatient);
router.put("/update-patient-status", updatePatientStatus);

module.exports = router;
