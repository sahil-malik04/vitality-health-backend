const { formatDate, sortData } = require("../helpers/common");
const {
  selectAllData,
  isUserExist,
  selectFirstData,
  insertData,
  updateData,
} = require("./dbService");

module.exports = {
  getPatientsUser,
  createPatientUser,
  updatePatientUser,
  deletePatientUser,
  updatePatientStatusUser,
};

// function to get patients
async function getPatientsUser(emailOrUsername) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const patientWhere = {
          status: "active",
          isDeleted: 0,
        };
        const data = await selectAllData("*", "patients", patientWhere);
        const formattedDate = formatDate(data, "dob");
        const sortedData = sortData(formattedDate);
        return resolve(sortedData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to create patient
async function createPatientUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const patientEmail = payload.email
          ? payload.email.toLowerCase().trim()
          : "";
        const emailWhere = {
          email: patientEmail,
          isDeleted: 0,
        };

        const emailExist = await selectFirstData("*", "patients", emailWhere);

        if (emailExist && emailExist.isDeleted !== 1) {
          return reject("Email already registered!");
        } else {
          const patientData = {
            firstName: payload.firstName ? payload.firstName.trim() : "",
            middleName: payload.middleName ? payload.middleName.trim() : "",
            lastName: payload.lastName ? payload.lastName.trim() : "",
            dob: new Date(payload.dob),
            sex: payload.sex,
            email: patientEmail,
            phoneNumber: payload.phoneNumber,
            homeNumber: payload.homeNumber,
            street: payload.street ? payload.street.trim() : "",
            city: payload.city ? payload.city.trim() : "",
            state: payload.state,
            zip: payload.zip,
            emergencyPhoneNumber: payload.emergencyPhoneNumber,
            emergencyContact: payload.emergencyContact,
            status: payload.status,
          };

          const result = await insertData(
            patientData,
            ["id", "email"],
            "patients"
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

// function to update patient
async function updatePatientUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const patientId = payload.id;
        const emailToCheck = payload.email
          ? payload.email.toLowerCase().trim()
          : "";
        const where = {
          isDeleted: 0,
        };
        const patientData = await selectAllData("*", "patients", where);
        const isPatientExist = patientData.find(
          (item) => item.id === patientId
        );

        const nameExistsExceptId = patientData
          .filter((obj) => obj.id !== patientId)
          .some((obj) => obj.email === emailToCheck);

        if (isPatientExist && isPatientExist.isDeleted !== 1) {
          if (nameExistsExceptId) {
            return reject("Patient email already exist!");
          } else {
            const patientIdWhere = {
              id: payload.id,
            };

            const updatedPatientData = {
              firstName: payload.firstName ? payload.firstName.trim() : "",
              middleName: payload.middleName ? payload.middleName.trim() : "",
              lastName: payload.lastName ? payload.lastName.trim() : "",
              dob: new Date(payload.dob),
              sex: payload.sex,
              email: emailToCheck,
              phoneNumber: payload.phoneNumber,
              homeNumber: payload.homeNumber,
              street: payload.street ? payload.street.trim() : "",
              city: payload.city ? payload.city.trim() : "",
              state: payload.state,
              zip: payload.zip,
              emergencyPhoneNumber: payload.emergencyPhoneNumber,
              emergencyContact: payload.emergencyContact,
              status: payload.status,
              updatedAt: new Date(),
            };

            const result = await updateData(
              updatedPatientData,
              ["id", "email"],
              "patients",
              patientIdWhere
            );

            if (result.length > 0) {
              return resolve(result);
            } else {
              return reject("Server error! Please try again");
            }
          }
        } else {
          return reject("No patient found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to delete patient
async function deletePatientUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const patientIdWhere = {
          id: payload.patientId,
        };
        const patientExist = await selectFirstData(
          "*",
          "patients",
          patientIdWhere
        );
        if (patientExist) {
          const patientData = {
            isDeleted: true,
            updatedAt: new Date(),
          };
          const result = await updateData(
            patientData,
            ["id", "isDeleted"],
            "patients",
            patientIdWhere
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No patient found");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function to update patient-status
async function updatePatientStatusUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const patientWhere = {
          id: payload.id,
          isDeleted: 0,
        };
        const isPatientExist = await selectFirstData(
          "*",
          "patients",
          patientWhere
        );
        if (isPatientExist && isPatientExist.isDeleted !== 1) {
          const updatedPatientData = {
            status: payload.status,
            updatedAt: new Date(),
          };
          const result = await updateData(
            updatedPatientData,
            ["id", "status"],
            "patients",
            patientWhere
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No patient found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
