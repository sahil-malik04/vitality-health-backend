const {
  selectAllData,
  isUserExist,
  selectFirstData,
  insertData,
  updateData,
  deleteData,
  selectAllDataMultipleJoin,
} = require("./dbService");

const knex = require("../config/db");
const { getJoinsData, sortData } = require("../helpers/common");

module.exports = {
  getReferrerGroupsUser,
  createReferrerGroupUser,
  updateReferrerGroupUser,
  deleteReferrerGroupUser,
  getReferrerGroupByIdUser,
  addReferrerInGroupUser,
  deleteReferrerFromGroupUser,
};

//function to get referrer-groups
async function getReferrerGroupsUser(emailOrUsername) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const referrerGroupwhere = {
          isDeleted: 0,
        };
        const data = await selectAllData(
          "*",
          "referrer_groups",
          referrerGroupwhere
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

//function to create referrer-group
async function createReferrerGroupUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const referrerGroupName = payload.name ? payload.name.trim() : "";
        const nameWhere = {
          name: referrerGroupName,
          isDeleted: 0,
        };
        const groupExist = await selectFirstData(
          "*",
          "referrer_groups",
          nameWhere
        );

        if (groupExist && groupExist.isDeleted !== 1) {
          return reject("Referrer group already registered!");
        } else {
          const referrerData = {
            name: referrerGroupName,
            description: payload.description ? payload.description.trim() : "",
          };

          const result = await insertData(
            referrerData,
            ["id", "name"],
            "referrer_groups"
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

//function to update referrer-group
async function updateReferrerGroupUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const referrerGroupId = payload.id;
        const nameToCheck = payload.name ? payload.name.trim() : "";
        const where = {
          isDeleted: 0,
        };
        const referrerGroupData = await selectAllData(
          "*",
          "referrer_groups",
          where
        );
        const isReferrerGroupExist = referrerGroupData.find(
          (item) => item.id === referrerGroupId
        );

        const nameExistsExceptId = referrerGroupData
          .filter((obj) => obj.id !== referrerGroupId)
          .some((obj) => obj.name === nameToCheck);

        if (isReferrerGroupExist && isReferrerGroupExist.isDeleted !== 1) {
          if (nameExistsExceptId) {
            return reject("Referrer_group name already exist!");
          } else {
            const referrerGroupIdWhere = {
              id: payload.id,
            };
            const updatedReferrerGroupData = {
              name: nameToCheck,
              description: payload.description
                ? payload.description.trim()
                : "",
              updatedAt: new Date(),
            };

            const result = await updateData(
              updatedReferrerGroupData,
              ["id", "name"],
              "referrer_groups",
              referrerGroupIdWhere
            );
            if (result.length > 0) {
              return resolve(result);
            } else {
              return reject("Server error! Please try again");
            }
          }
        } else {
          return reject("Referrer group not found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function to delete referrer-group
async function deleteReferrerGroupUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const referrerGroupIdWhere = {
          id: payload.groupId,
        };
        const referrerGroupExist = await selectFirstData(
          "*",
          "referrer_groups",
          referrerGroupIdWhere
        );
        if (referrerGroupExist) {
          const referrerGroupData = {
            isDeleted: true,
            updatedAt: new Date(),
          };
          const result = await updateData(
            referrerGroupData,
            ["id", "isDeleted"],
            "referrer_groups",
            referrerGroupIdWhere
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No referrer group found");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function to get referrer-group by id
async function getReferrerGroupByIdUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        let result = {};
        let referrersData = [];

        const referrerGroupWhere = {
          id: payload.groupId,
          isDeleted: 0,
        };
        const isReferrerGroupExist = await selectFirstData(
          "*",
          "referrer_groups",
          referrerGroupWhere
        );

        if (isReferrerGroupExist) {
          const manageReferrerWhere = {
            groupId: payload.groupId,
          };

          const joins = [
            getJoinsData(
              "referrer_groups",
              "manage_referrers.groupId",
              "=",
              "referrer_groups.id"
            ),
            getJoinsData(
              "referrers",
              "manage_referrers.referrerId",
              "=",
              "referrers.id"
            ),
          ];
          const fields = [
            "manage_referrers.*",
            knex.raw(
              "JSON_OBJECT('referrerGroupId', referrer_groups.id, 'name', referrer_groups.name, 'description', referrer_groups.description) as referrerGroupData"
            ),
            knex.raw(
              "JSON_OBJECT('referrersId', referrers.id, 'firstName', referrers.firstName, 'middleName', referrers.middleName, 'lastName', referrers.lastName, 'email', referrers.email) as referrersData"
            ),
          ];

          const data = await selectAllDataMultipleJoin(
            joins,
            fields,
            "manage_referrers",
            manageReferrerWhere
          );

          if (data) {
            data.map((x) => {
              let newData = JSON.parse(x.referrersData);
              newData = { ...newData, id: x.id };
              referrersData.push(newData);
            });
            result = {
              groupId: isReferrerGroupExist.id,
              groupName: isReferrerGroupExist.name,
              referrersData: referrersData,
            };
            return resolve(result);
          } else {
            result = {
              groupId: isReferrerGroupExist.id,
              groupName: isReferrerGroupExist.name,
              referrersData: [],
            };
            return resolve(result);
          }
        } else {
          return reject("No referrer group found!");
        }
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function to add referrer in group
async function addReferrerInGroupUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const referrerGroupWhere = {
          referrerId: payload.referrerId,
        };

        const groupIdWhere = {
          groupId: payload.groupId,
        };
        const isReferrerAlreadyAdded = await selectFirstData(
          "*",
          "manage_referrers",
          referrerGroupWhere,
          groupIdWhere
        );

        if (isReferrerAlreadyAdded.length > 0) {
          return reject("Referrer already added in the group");
        } else {
          const manageReferrerData = {
            referrerId: payload.referrerId,
            groupId: payload.groupId,
          };
          const result = await insertData(
            manageReferrerData,
            ["referrerId", "groupId"],
            "manage_referrers"
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

//function to delete referrer from group
async function deleteReferrerFromGroupUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const manageReferrerWhere = {
          id: payload.id,
        };
        const manageReferrerExist = await selectFirstData(
          "*",
          "manage_referrers",
          manageReferrerWhere
        );
        if (manageReferrerExist) {
          const result = await deleteData(
            "manage_referrers",
            "*",
            manageReferrerWhere
          );
          if (result) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No group found");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
