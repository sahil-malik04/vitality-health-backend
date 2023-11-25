const { sortData } = require("../helpers/common");
const {
  selectAllData,
  isUserExist,
  selectFirstData,
  insertData,
  updateData,
} = require("./dbService");

module.exports = {
  getReferrerUser,
  getReferrerForSelfUser,
  createReferrerUser,
  updateReferrerUser,
  deleteReferrerUser,
  updateReferrerStatusUser,
};

// function to get referrer
async function getReferrerUser(emailOrUsername) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const referrerwhere = {
          status: "active",
          isDeleted: 0,
        };
        const data = await selectAllData("*", "referrers", referrerwhere);
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

// function to get referrer for self
async function getReferrerForSelfUser() {
  return new Promise(async function (resolve, reject) {
    try {
      const referrerwhere = {
        status: "active",
        isDeleted: 0,
      };
      const data = await selectAllData("*", "referrers", referrerwhere);
      const sortedData = sortData(data);
      return resolve(sortedData);
    } catch (error) {
      return reject(error);
    }
  });
}

// function to create referrer
async function createReferrerUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const referrerEmail = payload.email
          ? payload.email.toLowerCase().trim()
          : "";
        const emailWhere = {
          email: referrerEmail,
          isDeleted: 0,
        };
        const emailExist = await selectFirstData("*", "referrers", emailWhere);
        if (emailExist && emailExist.isDeleted !== 1) {
          return reject("Email already registered!");
        } else {
          const referrerData = {
            firstName: payload.firstName ? payload.firstName.trim() : "",
            middleName: payload.middleName ? payload.middleName.trim() : "",
            lastName: payload.lastName ? payload.lastName.trim() : "",
            email: referrerEmail,
            street: payload.street ? payload.street.trim() : "",
            city: payload.city ? payload.city.trim() : "",
            state: payload.state,
            zip: payload.zip,
            phoneNumber: payload.phoneNumber,
            mobileNumber: payload.mobileNumber,
            faxNumber: payload.faxNumber,
            npi: payload.npi,
            practiceName: payload.practiceName
              ? payload.practiceName.trim()
              : "",
            status: payload.status,
          };
          const result = await insertData(
            referrerData,
            ["id", "email"],
            "referrers"
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

// function to update referrer
async function updateReferrerUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const referrerId = payload.id;
        const emailToCheck = payload.email
          ? payload.email.trim().toLowerCase()
          : "";
        const where = {
          isDeleted: 0,
        };
        const referrerData = await selectAllData("*", "referrers", where);
        const isReferrerExist = referrerData.find(
          (item) => item.id === referrerId
        );

        const nameExistsExceptId = referrerData
          .filter((obj) => obj.id !== referrerId)
          .some((obj) => obj.email === emailToCheck);

        if (isReferrerExist && isReferrerExist.isDeleted !== 1) {
          if (nameExistsExceptId) {
            return reject("Referrer already exist!");
          } else {
            const referrerIdWhere = {
              id: payload.id,
            };
            const updatedReferrerData = {
              firstName: payload.firstName ? payload.firstName.trim() : "",
              middleName: payload.middleName ? payload.middleName.trim() : "",
              lastName: payload.lastName ? payload.lastName.trim() : "",
              email: emailToCheck,
              street: payload.street ? payload.street.trim() : "",
              city: payload.city ? payload.city.trim() : "",
              state: payload.state,
              zip: payload.zip,
              phoneNumber: payload.phoneNumber,
              mobileNumber: payload.mobileNumber,
              faxNumber: payload.faxNumber,
              npi: payload.npi,
              practiceName: payload.practiceName
                ? payload.practiceName.trim()
                : "",
              status: payload.status,
              updatedAt: new Date(),
            };
            const result = await updateData(
              updatedReferrerData,
              ["id", "email"],
              "referrers",
              referrerIdWhere
            );
            if (result.length > 0) {
              return resolve(result);
            } else {
              return reject("Server error! Please try again");
            }
          }
        } else {
          return reject("No referrer found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to delete referrer
async function deleteReferrerUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const referrerIdWhere = {
          id: payload.referrerId,
        };
        const referrerExist = await selectFirstData(
          "*",
          "referrers",
          referrerIdWhere
        );
        if (referrerExist) {
          const referrerData = {
            isDeleted: true,
            updatedAt: new Date(),
          };
          const result = await updateData(
            referrerData,
            ["id", "isDeleted"],
            "referrers",
            referrerIdWhere
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No referrer found");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to update referrer-status
async function updateReferrerStatusUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const referrerWhere = {
          id: payload.id,
          isDeleted: 0,
        };
        const isReferrerExist = await selectFirstData(
          "*",
          "referrers",
          referrerWhere
        );
        if (isReferrerExist && isReferrerExist.isDeleted !== 1) {
          const updatedReferrerData = {
            status: payload.status,
            updatedAt: new Date(),
          };
          const result = await updateData(
            updatedReferrerData,
            ["id", "status"],
            "referrers",
            referrerWhere
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No referrer found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
