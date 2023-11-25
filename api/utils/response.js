const status = require("./status");

exports.successAction = successAction;
exports.failAction = failAction;

function successAction(data, message = "OK", isSuccess = true) {
  return { statusCode: status.SUCCESS, data, message, isSuccess };
}

function failAction(message) {
  return { statusCode: status.FAILURE, message };
}
