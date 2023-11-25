const { failAction, successAction } = require("../utils/response");
const { loginUser, logoutUser } = require("../services/authService");
const { verifyCookie } = require("../services/commonService");

// function to login user
exports.login = async function (req, res) {
  const payload = req.body;
  try {
    const result = await loginUser(payload);
    if (result.status === 200) {
      res
        .status(200)
        .json(successAction(result, "User Login Successfullly!", true));
    } else {
      res
        .status(200)
        .json(successAction(result.data, "Account is Not Verified!", false));
    }
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// function to logout user
exports.logout = async function (req, res) {
  try {
    const payload = req.body;
    const sessionId = req.headers?.cookies;
    const authData = await verifyCookie(sessionId);
    const result = await logoutUser(
      authData.emailOrUsername,
      sessionId,
      payload
    );
    if (result.status === 200) {
      res.status(200).json(successAction("User Logout Successfullly!", true));
    }
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
