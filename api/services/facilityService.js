const { sortData } = require("../helpers/common");
const {
  isUserExist,
  selectAllData,
  selectFirstData,
  insertData,
  updateData,
} = require("./dbService");

module.exports = {
  getFacilitiesUser,
  getFacilitiesForSelfUser,
  createFacilityUser,
  updateFacilityUser,
  deleteFacilityUser,
};

// function to get facility
async function getFacilitiesUser(emailOrUsername) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const facilityWhere = {
          status: "active",
          isDeleted: 0,
        };
        const data = await selectAllData("*", "facilities", facilityWhere);
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

// function to get facility for self
async function getFacilitiesForSelfUser() {
  return new Promise(async function (resolve, reject) {
    try {
      const facilityWhere = {
        status: "active",
        isDeleted: 0,
      };
      const data = await selectAllData("*", "facilities", facilityWhere);
      const sortedData = sortData(data);
      return resolve(sortedData);
    } catch (error) {
      return reject(error);
    }
  });
}

// function to create facility
async function createFacilityUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const facilityName = payload.name ? payload.name.trim() : "";
        const nameWhere = {
          name: facilityName,
          isDeleted: 0,
        };
        const nameExist = await selectFirstData("*", "facilities", nameWhere);

        if (nameExist && nameExist.isDeleted !== 1) {
          return reject("Facility name already exists!");
        } else {
          const facilityData = {
            name: facilityName,
            description: payload.description ? payload.description.trim() : "",
            street: payload.street ? payload.street.trim() : "",
            city: payload.city ? payload.city.trim() : "",
            state: payload.state,
            zip: payload.zip,
            phoneNumber: payload.phoneNumber,
            faxNumber: payload.faxNumber,
          };

          const result = await insertData(
            facilityData,
            ["id", "name"],
            "facilities"
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

// function to update facility
async function updateFacilityUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const facilityId = payload.id;
        const nameToCheck = payload.name ? payload.name.trim() : "";
        const where = {
          isDeleted: 0,
        };
        const facilityData = await selectAllData("*", "facilities", where);
        const isFacilityExist = facilityData.find(
          (item) => item.id === facilityId
        );

        const nameExistsExceptId = facilityData
          .filter((obj) => obj.id !== facilityId)
          .some((obj) => obj.name === nameToCheck);

        if (isFacilityExist && isFacilityExist.isDeleted !== 1) {
          if (nameExistsExceptId) {
            return reject("Facility already exist!");
          } else {
            const facilityIdWhere = {
              id: payload.id,
            };

            const updatedFacilityData = {
              name: nameToCheck,
              description: payload.description
                ? payload.description.trim()
                : "",
              street: payload.street ? payload.street.trim() : "",
              city: payload.city ? payload.city.trim() : "",
              state: payload.state,
              zip: payload.zip,
              phoneNumber: payload.phoneNumber,
              faxNumber: payload.faxNumber,
              updatedAt: new Date(),
            };
            const result = await updateData(
              updatedFacilityData,
              ["id", "name"],
              "facilities",
              facilityIdWhere
            );
            if (result.length > 0) {
              return resolve(result);
            } else {
              return reject("Server error! Please try again");
            }
          }
        } else {
          return reject("Facility doesn't exists!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to delete facility
async function deleteFacilityUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const facilityIdWhere = {
          id: payload.facilityId,
        };

        const facilityExist = await selectFirstData(
          "*",
          "facilities",
          facilityIdWhere
        );

        if (facilityExist) {
          const updatedFacilityData = {
            isDeleted: true,
            updatedAt: new Date(),
          };
          const result = await updateData(
            updatedFacilityData,
            ["id", "isDeleted"],
            "facilities",
            facilityIdWhere
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("Facility doesn't exists!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
