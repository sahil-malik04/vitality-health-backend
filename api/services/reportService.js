const {
  selectAllData,
  isUserExist,
  selectFirstData,
  updateData,
  insertData,
  selectAllDataMultipleJoin,
} = require("./dbService");

module.exports = {
  getReportsUser,
  createReportUser,
  updateReportUser,
  deleteReportUser,
  getReportsByAppointmentIdUser,
};

const knex = require("../config/db");
const { sortData } = require("../helpers/common");

//function to get reports
async function getReportsUser(emailOrUsername) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const reportWhere = {
          isDeleted: 0,
        };
        const data = await selectAllData("*", "reports", reportWhere);
        const sortedData = sortData(data);
        return resolve(sortedData);
      } else {
        return reject("No report found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function to create report
async function createReportUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const reportData = {
          appointmentId: payload.appointmentId,
          report: payload.report ? payload.report.trim() : "",
        };
        const result = await insertData(
          reportData,
          ["id", "appointmentId"],
          "reports"
        );

        if (result.length > 0) {
          return resolve(result);
        } else {
          return reject("Server error! Please try again");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function to update report
async function updateReportUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const reportWhere = {
          id: payload.id,
          isDeleted: 0,
        };
        const isReportExist = await selectFirstData(
          "*",
          "reports",
          reportWhere
        );

        if (isReportExist && isReportExist.isDeleted !== 1) {
          const updatedReportData = {
            appointmentId: payload.appointmentId,
            report: payload.report ? payload.report.trim() : "",
            updatedAt: new Date(),
          };
          const result = await updateData(
            updatedReportData,
            ["id", "appointmentId"],
            "reports",
            reportWhere
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No report found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function to delete report
async function deleteReportUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const reportIdWhere = {
          id: payload.reportId,
        };
        const reportExist = await selectFirstData(
          "*",
          "reports",
          reportIdWhere
        );
        if (reportExist) {
          const reportData = {
            isDeleted: true,
            updatedAt: new Date(),
          };
          const result = await updateData(
            reportData,
            ["id", "isDeleted"],
            "reports",
            reportIdWhere
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No report found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function to get reports by appointment id
async function getReportsByAppointmentIdUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const reportWhere = {
          appointmentId: payload.appointmentId,
        };

        const reportsExist = await selectFirstData("*", "reports", reportWhere);

        if (reportsExist) {
          const appointmentWhere = {
            "appointments.isDeleted": 0,
            "appointments.id": payload.appointmentId,
          };

          const joins = [
            {
              joinTable: "patients",
              firstCond: "appointments.patientId",
              operator: "=",
              secondCond: "patients.id",
            },
            {
              joinTable: "procedures",
              firstCond: "appointments.procedureId",
              operator: "=",
              secondCond: "procedures.id",
            },
            {
              joinTable: "facilities",
              firstCond: "appointments.facilityId",
              operator: "=",
              secondCond: "facilities.id",
            },
            {
              joinTable: "rooms",
              firstCond: "appointments.roomId",
              operator: "=",
              secondCond: "rooms.id",
            },
            {
              joinTable: "referrers",
              firstCond: "appointments.referrerId",
              operator: "=",
              secondCond: "referrers.id",
            },
          ];

          const fields = [
            "appointments.*",
            knex.raw(
              "JSON_OBJECT('patientId', patients.id, 'firstName', patients.firstName, 'middleName', patients.middleName, 'lastName', patients.lastName, 'email', patients.email, 'dob', patients.dob, 'sex', patients.sex, 'phoneNumber', patients.phoneNumber) as patientsData"
            ),
            knex.raw(
              "JSON_OBJECT('procedureId', procedures.id, 'name', procedures.name, 'parent', procedures.parent, 'level', procedures.level) as procedureData"
            ),
            knex.raw(
              "JSON_OBJECT('facilityId', facilities.id, 'name', facilities.name, 'faxNumber', facilities.faxNumber, 'street', facilities.street, 'city', facilities.city, 'state', facilities.state, 'zip', facilities.zip, 'phoneNumber', facilities.phoneNumber) as facilityData"
            ),
            knex.raw(
              "JSON_OBJECT('roomId', rooms.id, 'name', rooms.name) as roomsData"
            ),
            knex.raw(
              "JSON_OBJECT('referrerId', referrers.id, 'firstName', referrers.firstName, 'middleName', referrers.middleName, 'lastName', referrers.lastName, 'email', referrers.email, 'street', referrers.street, 'city', referrers.city, 'state', referrers.state, 'zip', referrers.zip, 'phoneNumber', referrers.phoneNumber) as referrersData"
            ),
          ];

          const appointmentData = await selectAllDataMultipleJoin(
            joins,
            fields,
            "appointments",
            appointmentWhere
          );
          if (appointmentData.length > 0) {
            reportsExist.appointmentData = appointmentData[0];
            return resolve(reportsExist);
          } else {
            return resolve(null);
          }
        } else {
          return resolve(null);
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
