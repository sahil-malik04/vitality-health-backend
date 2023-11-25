const {
  selectAllData,
  isUserExist,
  selectFirstData,
  insertData,
  updateData,
  selectAllDataJoin,
} = require("./dbService");

module.exports = {
  getEmployeesUser,
  createEmployeeUser,
  updateEmployeeUser,
  deleteEmployeeUser,
  updateEmployeeStatusUser,
};

const knex = require("../config/db");
const { sortData } = require("../helpers/common");

// function to get employees
async function getEmployeesUser(emailOrUsername) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const employeeWhere = {
          "employees.isDeleted": 0,
          "employees.status": "active",
        };
        const data = await selectAllDataJoin(
          "facilities",
          "employees.facilityId",
          "=",
          "facilities.id",
          "employees.*",
          knex.raw(
            "JSON_OBJECT('facilityId', facilities.id, 'facilityName', facilities.name) as facility"
          ),
          "employees",
          employeeWhere
        );
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

// function to create employee
async function createEmployeeUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const employeeEmail = payload.email
          ? payload.email.toLowerCase().trim()
          : "";
        const emailWhere = {
          email: employeeEmail,
          isDeleted: 0,
        };
        const emailExist = await selectFirstData("*", "employees", emailWhere);

        if (emailExist && emailExist.isDeleted !== 1) {
          return reject("Email already registered!");
        } else {
          const employeeData = {
            firstName: payload.firstName ? payload.firstName.trim() : "",
            middleName: payload.middleName ? payload.middleName.trim() : "",
            lastName: payload.lastName ? payload.lastName.trim() : "",
            email: employeeEmail,
            phoneNumber: payload.phoneNumber,
            mobileNumber: payload.mobileNumber,
            position: payload.position,
            facilityId: payload.facilityId,
            status: payload.status,
          };
          const result = await insertData(
            employeeData,
            ["id", "email"],
            "employees"
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

// function to update employee
async function updateEmployeeUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const employeeId = payload.id;
        const emailToCheck = payload.email
          ? payload.email.toLowerCase().trim()
          : "";
        const where = {
          isDeleted: 0,
        };
        const employeeData = await selectAllData("*", "employees", where);
        const isEmployeeExist = employeeData.find(
          (item) => item.id === employeeId
        );
        const nameExistsExceptId = employeeData
          .filter((obj) => obj.id !== employeeId)
          .some((obj) => obj.email === emailToCheck);

        if (isEmployeeExist && isEmployeeExist.isDeleted !== 1) {
          if (nameExistsExceptId) {
            return reject("Employee email already exist!");
          } else {
            const employeeIdWhere = {
              id: payload.id,
            };

            const updatedEmployeeData = {
              firstName: payload.firstName ? payload.firstName.trim() : "",
              middleName: payload.middleName ? payload.middleName.trim() : "",
              lastName: payload.lastName ? payload.lastName.trim() : "",
              email: emailToCheck,
              phoneNumber: payload.phoneNumber,
              mobileNumber: payload.mobileNumber,
              position: payload.position,
              facilityId: payload.facilityId,
              status: payload.status,
              updatedAt: new Date(),
            };

            const result = await updateData(
              updatedEmployeeData,
              ["id", "email"],
              "employees",
              employeeIdWhere
            );
            if (result.length > 0) {
              return resolve(result);
            } else {
              return reject("Server error! Please try again");
            }
          }
        } else {
          return reject("No employee found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function delete employee
async function deleteEmployeeUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const employeeIdWhere = {
          id: payload.employeeId,
        };
        const employeeExist = await selectFirstData(
          "*",
          "employees",
          employeeIdWhere
        );
        if (employeeExist) {
          const employeeData = {
            isDeleted: true,
            updatedAt: new Date(),
          };
          const result = await updateData(
            employeeData,
            ["id", "isDeleted"],
            "employees",
            employeeIdWhere
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No employee found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to update employee-status
async function updateEmployeeStatusUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const employeeWhere = {
          id: payload.id,
          isDeleted: 0,
        };

        const isEmployeeExist = await selectFirstData(
          "*",
          "employees",
          employeeWhere
        );
        if (isEmployeeExist && isEmployeeExist.isDeleted !== 1) {
          const updatedEmployeeData = {
            status: payload.status,
            updatedAt: new Date(),
          };
          const result = await updateData(
            updatedEmployeeData,
            ["id", "status"],
            "employees",
            employeeWhere
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No employee found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
