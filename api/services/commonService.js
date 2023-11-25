const { parseJwt } = require("../helpers/common");
const session = require("express-session");
const Filestore = require("session-file-store")(session);
const customSessionStore = new Filestore({
  ttl: 86400,
  reapInterval: 86400,
});

module.exports = {
  verifyAuthToken,
  verifyCookie,
};

// Function to verify auth token
async function verifyAuthToken(headerToken) {
  return new Promise(async function (resolve, reject) {
    try {
      const authToken = headerToken;
      const tokenData = authToken.split(" ");
      const token = tokenData[1];
      if (token) {
        const result = await parseJwt(token);
        if (result) {
          const emailOrUsername = result.preferred_username;
          return resolve({
            emailOrUsername: emailOrUsername,
          });
        } else {
          return reject("Unauthorized!");
        }
      } else {
        return reject("Unauthorized!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to verify cookie
async function verifyCookie(sessionId) {
  return new Promise(async function (resolve, reject) {
    try {
      customSessionStore.get(sessionId, (error, sessionData) => {
        if (error) {
          return reject("Unauthorized!");
        } else {
          if (sessionData) {
            const emailOrUsername = sessionData.user;
            return resolve({
              emailOrUsername: emailOrUsername,
            });
          } else {
            return reject("Unauthorized!");
          }
        }
      });
    } catch (error) {
      return reject(error);
    }
  });
}
