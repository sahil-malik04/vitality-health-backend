const { verifyCookie } = require("../services/commonService");
const { failAction, successAction } = require("../utils/response");
const {
  getReportsUser,
  createReportUser,
  updateReportUser,
  deleteReportUser,
  getReportsByAppointmentIdUser,
} = require("../services/reportService");

//function to get reports
exports.getReports = async function (req, res) {
  try {
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getReportsUser(authData.emailOrUsername);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to create report
exports.createReport = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await createReportUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to update report
exports.updateReport = async function (req, res) {
  try {
    const payload = req.body;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await updateReportUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to delete report
exports.deleteReport = async function (req, res) {
  try {
    const payload = req.params;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await deleteReportUser(authData.emailOrUsername, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

//function to get reports by appointment id
exports.getReportsByAppointmentId = async function (req, res) {
  try {
    const payload = req.params;
    const authData = await verifyCookie(req.headers?.cookies);
    const data = await getReportsByAppointmentIdUser(
      authData.emailOrUsername,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
