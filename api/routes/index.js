const express = require("express");

const router = express.Router();
const auth = require("./authRoutes");
const employee = require("./employeeRoutes");
const patient = require("./patientRoutes");
const appointment = require("./appointmentRoutes");
const room = require("./roomRoutes");
const referrer = require("./referrerRoutes");
const facility = require("./facilityRoutes");
const referrerGroup = require("./referrerGroupRoutes");
const report = require("./reportRoutes");
const procedure = require("./procedureRoutes");
const setting = require("./settingRoutes");
const role = require("./roleRoutes");

// API ROUTES
router.use("/auth", auth);
router.use("/employee", employee);
router.use("/patient", patient);
router.use("/referrer", referrer);
router.use("/appointment", appointment);
router.use("/room", room);
router.use("/facility", facility);
router.use("/referrer-group", referrerGroup);
router.use("/procedure", procedure);
router.use("/report", report);
router.use("/setting", setting);
router.use("/role", role);

module.exports = router;
