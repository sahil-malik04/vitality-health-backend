const onedxURL = process.env.ONEDX_URL;
const onedxClientId = process.env.ONEDX_CLIENT_ID;
const onedxClientSecret = process.env.ONEDX_CLIENT_SECRET;
const onedxGrantType = process.env.ONEDX_GRANT_TYPE;
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const customSessionStore = new FileStore({
  ttl: 86400,
  reapInterval: 86400,
});

const {
  insertData,
  selectFirstDataCondition,
  updateDataCondition,
  selectAllData,
  deleteData,
  isUserExist,
} = require("./dbService");
const {
  parseJwt,
  generateUniqueSessionId,
  generateRandomPassword,
} = require("../helpers/common");
const axios = require("axios");
const qs = require("qs");

module.exports = {
  loginUser,
  logoutUser,
};

// function to login user
async function loginUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const code = payload.code;
      const onedxRedirectUri = payload.redirectUri;
      const sessionId = generateUniqueSessionId();

      const data = {
        code: code,
        client_id: onedxClientId,
        client_secret: onedxClientSecret,
        redirect_uri: onedxRedirectUri,
        grant_type: onedxGrantType,
      };

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      const generateTokenURL = `${onedxURL}/sso/realms/onedx/protocol/openid-connect/token`;

      const generateAccessToken = await axios.post(
        generateTokenURL,
        qs.stringify(data),
        config
      );

      if (generateAccessToken) {
        const keycloakAccessToken = generateAccessToken.data.access_token;
        const userInfo = parseJwt(keycloakAccessToken);
        const parseId = generateAccessToken.data.id_token;
        const parseIdToken = parseJwt(parseId);
        const emailOrUsername = userInfo.preferred_username;

        const name = parseIdToken?.name ? parseIdToken.name : "";
        const firstName = parseIdToken?.given_name
          ? parseIdToken.given_name
          : "";
        const middleName = parseIdToken?.middle_name
          ? parseIdToken.middle_name
          : "";
        const lastName = parseIdToken?.family_name
          ? parseIdToken.family_name
          : "";

        const randomPassword = generateRandomPassword();
        const sessionData = {
          user: emailOrUsername,
          userRole: parseIdToken.groups,
        };

        const emailWhere = {
          email: emailOrUsername.toLowerCase(),
        };
        const userNameWhere = {
          userName: emailOrUsername.toLowerCase(),
        };

        const decryptUsername = parseIdToken.preferred_username
          ? parseIdToken.preferred_username
          : "";
        const decryptEmail = parseIdToken.email ? parseIdToken.email : "";

        const userExist = await selectFirstDataCondition(
          "*",
          "users",
          emailWhere,
          userNameWhere
        );

        const availableRoles = await selectAllData("*", "roles");
        const matchedRoles = availableRoles.filter((item) =>
          parseIdToken.groups.includes(item.pattern)
        );
        const userRolesData = [];
        const patterns = [];
        const permissions = [];
        let flattenedPermissions = [];

        const userData = {
          userName: emailOrUsername.includes(".com")
            ? decryptUsername
            : emailOrUsername,
          email: emailOrUsername.includes(".com")
            ? emailOrUsername
            : decryptEmail,
          name: name,
          firstName: firstName,
          middleName: middleName,
          lastName: lastName,
        };

        if (userExist && userExist.isDeleted === 0) {
          const userWhere = {
            userId: userExist.id,
          };

          await deleteData("user_roles", "*", userWhere);

          if (matchedRoles.length > 0) {
            matchedRoles.forEach((row) => {
              const pattern = row.pattern;
              const permission = row.permissions;
              userRolesData.push({
                roleId: row.id,
                userId: userExist.id,
              });
              patterns.push(pattern);
              permissions.push(permission);
            });

            await insertData(
              userRolesData,
              ["id", "roleId", "userId"],
              "user_roles"
            );
          }

          userData.userRole = JSON.stringify(patterns);

          flattenedPermissions = [
            ...new Set(
              permissions
                .filter((item) => item !== null)
                .flatMap((item) => JSON.parse(item))
            ),
          ];

          const updateUser = await updateDataCondition(
            userData,
            "id",
            "users",
            emailWhere,
            userNameWhere
          );
          if (updateUser.length > 0) {
            customSessionStore.set(sessionId, sessionData, (error) => {
              if (error) {
                reject("Error occurred while storing session data");
              } else {
                return resolve({
                  status: 200,
                  cookie: sessionId,
                  userId: userExist.id,
                  userName: decryptUsername,
                  firstName: firstName,
                  name: name,
                  userRole: patterns,
                  permissions: flattenedPermissions,
                  accessToken: generateAccessToken.data,
                });
              }
            });
          } else {
            return reject("Server error!");
          }
        } else {
          if (matchedRoles.length > 0) {
            matchedRoles.forEach((row) => {
              const pattern = row.pattern;
              const permission = row.permissions;
              patterns.push(pattern);
              permissions.push(permission);
            });
          }

          userData.password = randomPassword;
          userData.userRole = JSON.stringify(patterns);

          const insertUser = await insertData(userData, "id", "users");

          if (insertUser.length > 0) {
            if (matchedRoles.length > 0) {
              matchedRoles.forEach((row) => {
                userRolesData.push({
                  roleId: row.id,
                  userId: insertUser[0].id,
                });
              });
              await insertData(
                userRolesData,
                ["id", "roleId", "userId"],
                "user_roles"
              );
            }
            flattenedPermissions = [
              ...new Set(
                permissions
                  .filter((item) => item !== null)
                  .flatMap((item) => JSON.parse(item))
              ),
            ];

            customSessionStore.set(sessionId, sessionData, (error) => {
              if (error) {
                reject("Error occurred while storing session data");
              } else {
                return resolve({
                  status: 200,
                  cookie: sessionId,
                  userId: insertUser[0].id,
                  userName: decryptUsername,
                  firstName: firstName,
                  name: name,
                  userRole: patterns,
                  permissions: flattenedPermissions,
                  accessToken: generateAccessToken.data,
                });
              }
            });
          }
        }
      } else {
        return reject("Server error!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to logout user
async function logoutUser(emailOrUsername, sessionId, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const refreshToken = payload.refreshToken;
        const accessToken = payload.accessToken;

        const data = {
          client_id: onedxClientId,
          client_secret: onedxClientSecret,
          refresh_token: refreshToken,
        };

        const config = {
          headers: { Authorization: `Bearer ${accessToken}` },
        };
        const logoutURL = `${onedxURL}/sso/realms/onedx/protocol/openid-connect/logout`;

        const result = await axios.post(logoutURL, qs.stringify(data), config);

        if (result) {
          customSessionStore.destroy(sessionId, (error) => {
            if (error) {
              reject("Error occurred while destroying session");
            } else {
              return resolve({
                status: 200,
              });
            }
          });
        } else {
          return reject("Server error!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
