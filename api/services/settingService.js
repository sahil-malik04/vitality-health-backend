const { formatDate } = require("../helpers/common");
const { generateTimeIntervals } = require("../utils/utility");
const knex = require("../config/db");

const {
  isUserExist,
  selectFirstData,
  updateData,
  insertData,
  selectAllDataCondition,
} = require("./dbService");

module.exports = {
  getSettingsUser,
  updateSettingsUser,
  getAvailableTimeSlotsUser,
  getAvailableTimeSlotsSelfUser,
};

// function to get settings
async function getSettingsUser(emailOrUsername) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const where = {
          id: 1,
        };
        const result = await selectFirstData("*", "settings", where);
        return resolve(result);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to update setting
async function updateSettingsUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const settingWhere = {
          id: 1,
        };
        const isSettingExist = await selectFirstData(
          "*",
          "settings",
          settingWhere
        );

        const settingData = {
          timeInterval: payload.timeInterval,
          appointmentLimit: payload.appointmentLimit,
        };

        if (isSettingExist) {
          const result = await updateData(
            settingData,
            ["id", "timeInterval", "appointmentLimit"],
            "settings",
            settingWhere
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          const result = await insertData(
            settingData,
            ["id", "timeInterval", "appointmentLimit"],
            "settings"
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

// function to get available time slots
async function getAvailableTimeSlotsUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        let timeInterval;
        let appointmentLimit;

        const settingWhere = {
          id: 1,
        };
        const settings = await selectFirstData("*", "settings", settingWhere);

        if (!settings) {
          timeInterval = 30;
          appointmentLimit = 5;
          const settingData = {
            id: 1,
            timeInterval: timeInterval,
            appointmentLimit: appointmentLimit,
          };
          await insertData(settingData, ["*"], "settings");
        } else {
          timeInterval = settings.timeInterval;
          appointmentLimit = settings.appointmentLimit;
        }

        const timeIntervals = generateTimeIntervals(timeInterval);

        const where = knex.raw(`DATE(startDate) = ?`, payload.date);
        const where2 = { isDeleted: 0 };

        const data = await selectAllDataCondition(
          "*",
          "appointments",
          where,
          where2
        );

        const formattedData = formatDate(data, "startDate");

        const slotOccurrences = timeIntervals.reduce(
          (occurrences, timeInterval) => {
            const count =
              appointmentLimit -
              formattedData.filter((appointment) => {
                return (
                  appointment.timeSlot === timeInterval &&
                  appointment.startDate === payload.date
                );
              }).length;
            count > 0
              ? occurrences.push({ timeInterval, count })
              : occurrences.push({ timeInterval, count: 0 });

            return occurrences;
          },
          []
        );

        if (slotOccurrences) {
          return resolve(slotOccurrences);
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

// function to get available time slots self
async function getAvailableTimeSlotsSelfUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      let timeInterval;
      let appointmentLimit;

      const settingWhere = {
        id: 1,
      };
      const settings = await selectFirstData("*", "settings", settingWhere);

      if (!settings) {
        timeInterval = 30;
        appointmentLimit = 5;
        const settingData = {
          id: 1,
          timeInterval: timeInterval,
          appointmentLimit: appointmentLimit,
        };
        await insertData(settingData, ["*"], "settings");
      } else {
        timeInterval = settings.timeInterval;
        appointmentLimit = settings.appointmentLimit;
      }

      const timeIntervals = generateTimeIntervals(timeInterval);

      const where = knex.raw(`DATE(startDate) = ?`, payload.date);
      const where2 = { isDeleted: 0 };

      const data = await selectAllDataCondition(
        "*",
        "appointments",
        where,
        where2
      );

      const formattedData = formatDate(data, "startDate");

      const slotOccurrences = timeIntervals.reduce(
        (occurrences, timeInterval) => {
          const count =
            appointmentLimit -
            formattedData.filter((appointment) => {
              return (
                appointment.timeSlot === timeInterval &&
                appointment.startDate === payload.date
              );
            }).length;
          count > 0
            ? occurrences.push({ timeInterval, count })
            : occurrences.push({ timeInterval, count: 0 });

          return occurrences;
        },
        []
      );

      if (slotOccurrences) {
        return resolve(slotOccurrences);
      } else {
        return reject("Server error! Please try again");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
