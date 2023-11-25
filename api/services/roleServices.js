const { sortData } = require("../helpers/common");
const {
  selectAllData,
  isUserExist,
  selectFirstData,
  insertData,
  updateData,
  deleteData,
  selectFirstDataCondition,
} = require("./dbService");

module.exports = {
  getRolesUser,
  createRoleUser,
  updateRoleUser,
  deleteRoleUser,
};

// function to get roles
async function getRolesUser(emailOrUsername) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const data = await selectAllData("*", "roles");
        const sortedData = sortData(data);
        return resolve(sortedData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to create role
async function createRoleUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const role = payload.role.toLowerCase();
        const pattern = payload.pattern;

        const roleWhere = {
          role: role,
        };
        const patternWhere = {
          pattern: pattern,
        };
        const isRoleExist = await selectFirstDataCondition(
          "*",
          "roles",
          roleWhere,
          patternWhere
        );
        if (isRoleExist) {
          return reject("Role already exist");
        } else {
          const roleData = {
            role: role,
            pattern: pattern,
            permissions: JSON.stringify(payload.permissions),
          };
          const result = await insertData(
            roleData,
            ["id", "role", "pattern", "permissions"],
            "roles"
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to update role
async function updateRoleUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const roleId = payload.id;
        const roleToCheck = payload.role.toLowerCase();
        const patternToCheck = payload.pattern;

        const roleData = await selectAllData("*", "roles");
        const isRoleExist = roleData.find((item) => item.id === roleId);

        const roleOrpatternExistExceptID = roleData
          .filter((obj) => obj.id !== roleId)
          .some(
            (obj) => obj.role === roleToCheck || obj.pattern === patternToCheck
          );

        if (isRoleExist) {
          if (roleOrpatternExistExceptID) {
            return reject("Role already exists!");
          } else {
            const roleWhere = {
              id: payload.id,
            };

            const roleData = {
              role: roleToCheck,
              pattern: patternToCheck,
              permissions: JSON.stringify(payload.permissions),
            };
            const result = await updateData(
              roleData,
              ["id", "role", "pattern", "permissions"],
              "roles",
              roleWhere
            );
            if (result.length > 0) {
              return resolve(result);
            } else {
              return reject("Server error! Please try again");
            }
          }
        } else {
          return reject("No role found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to delete role
async function deleteRoleUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const roleWhere = {
          id: payload.roleId,
        };

        const userRoleWhere = {
          roleId: payload.roleId,
        };
        const userRoleExist = await selectFirstData(
          "*",
          "user_roles",
          userRoleWhere
        );
        if (userRoleExist) {
          const deleteUserRole = await deleteData(
            "user_roles",
            "*",
            userRoleWhere
          );
          if (deleteUserRole) {
            const roleExist = await selectFirstData("*", "roles", roleWhere);
            if (roleExist) {
              const deleteRole = await deleteData("roles", "*", roleWhere);
              if (deleteRole) {
                return resolve(deleteRole);
              } else {
                return reject("Server error! Please try again");
              }
            } else {
              return reject("Server error! Please try again");
            }
          }
        } else {
          const deleteRole = await deleteData("roles", "*", roleWhere);
          if (deleteRole) {
            return resolve(deleteRole);
          } else {
            return reject("Server error! Please try again");
          }
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
