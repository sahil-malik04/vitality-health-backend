const { sortData } = require("../helpers/common");
const {
  selectAllData,
  isUserExist,
  selectFirstData,
  insertData,
  updateData,
} = require("./dbService");

module.exports = {
  getRoomsUser,
  createRoomUser,
  updateRoomUser,
  deleteRoomUser,
};

// function to get rooms
async function getRoomsUser(emailOrUsername) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const roomWhere = {
          status: "active",
          isDeleted: 0,
        };
        const data = await selectAllData("*", "rooms", roomWhere);
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

// function to create room
async function createRoomUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const roomName = payload.name ? payload.name.trim() : "";
        const nameWhere = {
          name: roomName,
          isDeleted: 0,
        };
        const roomExist = await selectFirstData("*", "rooms", nameWhere);

        if (roomExist && roomExist.isDeleted !== 1) {
          return reject("Room already exists!");
        } else {
          const roomData = {
            name: roomName,
            description: payload.description ? payload.description.trim() : "",
          };
          const result = await insertData(roomData, ["id", "name"], "rooms");

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

// function to update room
async function updateRoomUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const roomId = payload.id;
        const nameToCheck = payload.name ? payload.name.trim() : "";
        const where = {
          isDeleted: 0,
        };
        const roomData = await selectAllData("*", "rooms", where);
        const isRoomExist = roomData.find((item) => item.id === roomId);

        const nameExistsExceptId = roomData
          .filter((obj) => obj.id !== roomId)
          .some((obj) => obj.name === nameToCheck);

        if (isRoomExist && isRoomExist.isDeleted !== 1) {
          if (nameExistsExceptId) {
            return reject("Room already exist!");
          } else {
            const roomIdWhere = {
              id: payload.id,
            };

            const updatedRoomData = {
              name: nameToCheck,
              description: payload.description
                ? payload.description.trim()
                : "",
              updatedAt: new Date(),
            };
            const result = await updateData(
              updatedRoomData,
              ["id", "name"],
              "rooms",
              roomIdWhere
            );
            if (result.length > 0) {
              return resolve(result);
            } else {
              return reject("Server error! Please try again");
            }
          }
        } else {
          return reject("Room not found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// function to delete room
async function deleteRoomUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const roomIdWhere = {
          id: payload.roomId,
        };
        const roomExist = await selectFirstData("*", "rooms", roomIdWhere);

        if (roomExist) {
          const updatedRoomData = {
            isDeleted: true,
            updatedAt: new Date(),
          };
          const result = await updateData(
            updatedRoomData,
            ["id", "isDeleted"],
            "rooms",
            roomIdWhere
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("Room not found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
