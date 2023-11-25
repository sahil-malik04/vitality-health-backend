const express = require("express");
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointmentDate,
  getSelfAppointments,
  createSelfAppointment,
  getAppointmentByStatus,
  getAppointmentByPatientId,
} = require("../controllers/appointmentController");

router.get("/get-appointments", getAppointments);
router.post("/create-appointment", createAppointment);
router.put("/update-appointment", updateAppointment);
router.delete("/delete-appointment/:appointmentId", deleteAppointment);
router.get("/get-appointment-by-id/:appointmentId", getAppointmentById);
router.patch("/update-appointment-status", updateAppointmentStatus);
router.patch("/update-appointment-date", updateAppointmentDate);
router.get("/get-self-appointments", getSelfAppointments);
router.post("/create-self-appointment", createSelfAppointment);
router.get("/get-appointment-by-status/:status", getAppointmentByStatus);
router.get(
  "/get-appointments-by-patient-id/:patientId",
  getAppointmentByPatientId
);

module.exports = router;
