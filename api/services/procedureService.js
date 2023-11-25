const { sortData } = require("../helpers/common");
const {
  selectAllData,
  isUserExist,
  selectFirstData,
  updateData,
  insertData,
} = require("./dbService");

module.exports = {
  getProceduresUser,
  getProceduresForSelfUser,
  createProcedureUser,
  updateProcedureUser,
  deleteProcedureUser,
};

//function to get procedures
async function getProceduresUser(emailOrUsername) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const procedureWhere = {
          isDeleted: 0,
        };
        const data = await selectAllData("*", "procedures", procedureWhere);
        const sortedData = sortData(data);
        return resolve(sortedData);
      } else {
        return reject("No procedure found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function to get procedures for self
async function getProceduresForSelfUser() {
  return new Promise(async function (resolve, reject) {
    try {
      const procedureWhere = {
        isDeleted: 0,
      };
      const data = await selectAllData("*", "procedures", procedureWhere);
      const sortedData = sortData(data);
      return resolve(sortedData);
    } catch (error) {
      return reject(error);
    }
  });
}

//function to create procedure
async function createProcedureUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const procedureData = {
          name: payload.name ? payload.name.trim() : "",
          parent: payload.parent,
          level: payload.level,
          type: payload.type,
          weight: payload.weight,
          notes: payload.notes ? payload.notes.trim() : "",
          cpt: payload.cpt,
        };
        const result = await insertData(
          procedureData,
          ["id", "name"],
          "procedures"
        );

        if (result.length > 0) {
          return resolve(result);
        } else {
          return reject("Server error! Please try again");
        }
      } else {
        return reject("No procedure found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function to update procedure
async function updateProcedureUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const where = {
          id: payload.id,
        };
        const isProcedureExist = await selectFirstData(
          "*",
          "procedures",
          where
        );

        if (isProcedureExist && isProcedureExist.isDeleted !== 1) {
          const updatedProcedureData = {
            name: payload.name ? payload.name.trim() : "",
            parent: payload.parent,
            level: payload.level,
            type: payload.type,
            weight: payload.weight,
            notes: payload.notes ? payload.notes.trim() : "",
            cpt: payload.cpt,
            updatedAt: new Date(),
          };
          const result = await updateData(
            updatedProcedureData,
            ["id", "name"],
            "procedures",
            where
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No procedure found!");
        }
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function to delete procedure
async function deleteProcedureUser(emailOrUsername, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(emailOrUsername)) {
        const procedureIdWhere = {
          id: payload.procedureId,
        };
        const procedureExist = await selectFirstData(
          "*",
          "procedures",
          procedureIdWhere
        );
        if (procedureExist) {
          const procedureData = {
            isDeleted: true,
            updatedAt: new Date(),
          };
          const result = await updateData(
            procedureData,
            ["id", "isDeleted"],
            "procedures",
            procedureIdWhere
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No procedure found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
