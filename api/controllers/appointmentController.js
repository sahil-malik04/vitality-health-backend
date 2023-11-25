const { verifyCookie } = require("../services/commonService");
const { failAction, successAction } = require("../utils/response");
const {
  getAppointmentsUser,
  createAppointmentUser,
  updateAppointmentUser,
  deleteAppointmentUser,
  getAppointmentByIdUser,
  updateAppointmentStatusUser,
  updateAppointmentDateUser,
  getSelfAppointmentsUser,
  createSelfAppointmentUser,
  getAppointmentByStatusUser,
  getAppointmentByPatientIdUser,
} = require("../services/appointmentService");

// function to get appointments
exports.getAppointments = async function (req, res) {
  try {
    const authData = await verifyCookie(req.headers.cookies);
    const data = await getAppointmentsUser(authData.emailOrUsername);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to create appointment
exports.createAppointment = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await createAppointmentUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to update appointment
exports.updateAppointment = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await updateAppointmentUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to delete appointment
exports.deleteAppointment = async function (req, res) {
  try {
    const payload = req.params;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await deleteAppointmentUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to get appointment by id
exports.getAppointmentById = async function (req, res) {
  try {
    const payload = req.params;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getAppointmentByIdUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to update appointment status
exports.updateAppointmentStatus = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await updateAppointmentStatusUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to update appointment date
exports.updateAppointmentDate = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await updateAppointmentDateUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to get self appointments
exports.getSelfAppointments = async function (req, res) {
  try {
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getSelfAppointmentsUser(authData.emailOrUsername);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to create self appointment
exports.createSelfAppointment = async function (req, res) {
  try {
    const payload = req.body;
    const data = await createSelfAppointmentUser(payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to get appointment by status
exports.getAppointmentByStatus = async function (req, res) {
  try {
    const payload = req.params;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getAppointmentByStatusUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to get appointment by patient id
exports.getAppointmentByPatientId = async function (req, res) {
  try {
    const payload = req.params;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getAppointmentByPatientIdUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
