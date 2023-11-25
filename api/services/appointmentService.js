const {
  selectAllData,
  isUserExist,
  selectFirstData,
  insertData,
  updateData,
  selectAllDataMultipleJoin,
} = require("./dbService");

module.exports = {
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
};

const knex = require("../config/db");
const { formatDate, sortData } = require("../helpers/common");

// function to get appointments
async function getAppointmentsUser(emailOrUsername) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
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
            "JSON_OBJECT('facilityId', facilities.id, 'name', facilities.name) as facilityData"
          ),
          knex.raw(
            "JSON_OBJECT('roomId', rooms.id, 'name', rooms.name) as roomsData"
          ),
          knex.raw(
            "JSON_OBJECT('referrerId', referrers.id, 'firstName', referrers.firstName, 'middleName', referrers.middleName, 'lastName', referrers.lastName, 'email', referrers.email) as referrersData"
          ),
        ];

        const appointmentWhere = {
          "appointments.isDeleted": 0,
        };
        const data = await selectAllDataMultipleJoin(
          joins,
          fields,
          "appointments",
          appointmentWhere
        );

        const formattedDate = formatDate(data, "startDate");
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

//function to create appointment
async function createAppointmentUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const splitTimeSlot = payload.timeSlot.split("-")[0];
      const startDate = `${payload.startDate} ${splitTimeSlot}:00`;

      if (await isUserExist(emailOrUsername)) {
        const appointmentData = {
          title: payload.title ? payload.title.trim() : "",
          patientId: payload.patientId,
          facilityId: payload.facilityId,
          procedureId: payload.procedureId,
          roomId: payload.roomId,
          referrerId: payload.referrerId,
          startDate: new Date(startDate),
          timeSlot: payload.timeSlot,
          isSelf: false,
          category: payload.category,
          status: payload.status,
        };
        const result = await insertData(
          appointmentData,
          ["id", "title"],
          "appointments"
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

//function to update appointment
async function updateAppointmentUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const appointmentWhere = {
          id: payload.id,
          isDeleted: 0,
        };
        const isAppointmentExist = await selectFirstData(
          "*",
          "appointments",
          appointmentWhere
        );
        if (
          isAppointmentExist &&
          isAppointmentExist.isDeleted !== 1 &&
          isAppointmentExist.isSelf === 0
        ) {
          const updatedAppointmentData = {
            title: payload.title ? payload.title.trim() : "",
            patientId: payload.patientId,
            facilityId: payload.facilityId,
            procedureId: payload.procedureId,
            roomId: payload.roomId,
            referrerId: payload.referrerId,
            startDate: new Date(payload.startDate),
            timeSlot: payload.timeSlot,
            isSelf: false,
            category: payload.category,
            status: payload.status,
            updatedAt: new Date(),
          };
          const result = await updateData(
            updatedAppointmentData,
            ["id", "title"],
            "appointments",
            appointmentWhere
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No appointment found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function to delete appointment
async function deleteAppointmentUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const appointmentIdwhere = {
          id: payload.appointmentId,
        };

        const appointmentExist = await selectFirstData(
          "*",
          "appointments",
          appointmentIdwhere
        );
        if (appointmentExist) {
          const appointmentData = {
            isDeleted: true,
            updatedAt: new Date(),
          };
          const result = await updateData(
            appointmentData,
            ["id", "isDeleted"],
            "appointments",
            appointmentIdwhere
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No appointment found");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function to get appointment by id
async function getAppointmentByIdUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const where = {
          id: payload.appointmentId,
          isDeleted: 0,
        };
        const isAppointmentExist = await selectFirstData(
          "*",
          "appointments",
          where
        );
        if (isAppointmentExist) {
          const formattedDate = formatDate(isAppointmentExist, "startDate");
          return resolve(formattedDate);
        } else {
          return reject("No appointment found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to update appointment status
async function updateAppointmentStatusUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const appointmentWhere = {
          id: payload.id,
        };
        const isAppointmentExist = await selectFirstData(
          "*",
          "appointments",
          appointmentWhere
        );
        if (isAppointmentExist && isAppointmentExist.isDeleted !== 1) {
          const updatedAppointmentData = {
            status: payload.status,
            updatedAt: new Date(),
          };
          if (payload.status === "completed") {
            updatedAppointmentData.completionDate = new Date();
          }
          if (payload.status === "final") {
            updatedAppointmentData.finalDate = new Date();
          }

          const result = await updateData(
            updatedAppointmentData,
            ["id", "status"],
            "appointments",
            appointmentWhere
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No appointment found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to update appointment date
async function updateAppointmentDateUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const appointmentWhere = {
          id: payload.id,
        };
        const isAppointmentExist = await selectFirstData(
          "*",
          "appointments",
          appointmentWhere
        );
        if (isAppointmentExist && isAppointmentExist.isDeleted !== 1) {
          const updatedAppointmentData = {
            startDate: new Date(payload.updatedStartDate),
            updatedAt: new Date(),
          };

          const result = await updateData(
            updatedAppointmentData,
            ["id", "startDate"],
            "appointments",
            appointmentWhere
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No appointment found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to get self appointments
async function getSelfAppointmentsUser(emailOrUsername) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const appointmentWhere = {
          isDeleted: 0,
          isSelf: 1,
        };
        const data = await selectAllData("*", "appointments", appointmentWhere);

        const formattedDate = formatDate(data, "startDate");
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

// function to create self appointment
async function createSelfAppointmentUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const patientEmail = payload.email
        ? payload.email.toLowerCase().trim()
        : "";
      const emailWhere = {
        email: patientEmail,
        isDeleted: 0,
      };

      const patientExist = await selectFirstData("*", "patients", emailWhere);

      if (!patientExist) {
        const patientData = {
          firstName: payload.firstName ? payload.firstName.trim() : "",
          middleName: payload.middleName ? payload.middleName.trim() : "",
          lastName: payload.lastName ? payload.lastName.trim() : "",
          dob: new Date(payload.dob),
          sex: payload.sex,
          email: patientEmail,
          phoneNumber: payload.phoneNumber,
          street: payload.street ? payload.street.trim() : "",
          city: payload.city ? payload.city.trim() : "",
          state: payload.state,
          zip: payload.zip,
        };
        const insertPatientData = await insertData(
          patientData,
          ["id", "email"],
          "patients"
        );

        if (insertPatientData.length > 0) {
          const patientId = insertPatientData[0].id;

          const selfAppointmentData = {
            patientId: patientId,
            facilityId: payload.facilityId,
            procedureId: payload.procedureId,
            roomId: payload.roomId,
            referrerId: payload.referrerId,
            startDate: new Date(payload.startDate),
            timeSlot: payload.timeSlot,
            comments: payload.comments,
            isSelf: true,
            category: payload.category,
            status: "pending",
          };

          const insertAppointmentData = await insertData(
            selfAppointmentData,
            ["id", "patientId"],
            "appointments"
          );

          if (insertAppointmentData.length > 0) {
            return resolve(insertAppointmentData);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("Server error! Please try again");
        }
      } else {
        return reject("Patient email already registered");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to get appointment by status
async function getAppointmentByStatusUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
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
        ];

        const fields = [
          "appointments.*",
          knex.raw(
            "JSON_OBJECT('patientId', patients.id, 'firstName', patients.firstName, 'middleName', patients.middleName, 'lastName', patients.lastName, 'email', patients.email, 'dob', patients.dob, 'sex', patients.sex, 'phoneNumber', patients.phoneNumber) as patientsData"
          ),
          knex.raw(
            "JSON_OBJECT('procedureId', procedures.id, 'name', procedures.name, 'parent', procedures.parent, 'level', procedures.level) as procedureData"
          ),
        ];

        const where = {
          "appointments.status": payload.status,
          "appointments.isDeleted": 0,
        };
        const data = await selectAllDataMultipleJoin(
          joins,
          fields,
          "appointments",
          where
        );
        const formattedData = formatDate(data, "startDate");

        const sortedData = sortData(formattedData);

        if (payload.status === "completed") {
          const reportData = await selectAllData("*", "reports");
          const newFormattedData = sortedData.map((item) => {
            const isReport = reportData.some(
              (report) => report.appointmentId === item.id
            );
            return { ...item, isReport };
          });

          return resolve(newFormattedData);
        }

        return resolve(sortedData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to get appointment by patient id
async function getAppointmentByPatientIdUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
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
            "JSON_OBJECT('facilityId', facilities.id, 'name', facilities.name) as facilityData"
          ),
          knex.raw(
            "JSON_OBJECT('roomId', rooms.id, 'name', rooms.name) as roomsData"
          ),
          knex.raw(
            "JSON_OBJECT('referrerId', referrers.id, 'firstName', referrers.firstName, 'middleName', referrers.middleName, 'lastName', referrers.lastName, 'email', referrers.email) as referrersData"
          ),
        ];

        const where = {
          patientId: payload.patientId,
          "appointments.isDeleted": 0,
        };
        const data = await selectAllDataMultipleJoin(
          joins,
          fields,
          "appointments",
          where
        );

        const formattedDate = formatDate(data, "startDate");
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
