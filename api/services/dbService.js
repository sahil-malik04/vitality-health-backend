const knex = require("../config/db");

module.exports = {
  isUserExist,
  selectFirstData,
  selectAllData,
  selectAllDataCondition,
  insertData,
  updateData,
  deleteData,
  selectFirstDataCondition,
  selectAllDataJoin,
  selectAllDataMultipleJoin,
  updateDataCondition,
};

// Function to select first data from db
async function isUserExist(emailOrUsername) {
  return new Promise(async function (resolve, reject) {
    try {
      const userExist = await knex("users")
        .where({
          email: emailOrUsername.toLowerCase(),
        })
        .orWhere({
          userName: emailOrUsername.toLowerCase(),
        })
        .select("*")
        .first();
      if (userExist) {
        return resolve(true);
      } else {
        return resolve(false);
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to select first data from db
async function selectFirstData(fields, from, where, where2) {
  return new Promise(async function (resolve, reject) {
    try {
      let data;
      data = await knex.select(fields).from(from).where(where).first();
      if (where2) {
        data = await knex
          .select(fields)
          .from(from)
          .where(where)
          .andWhere(where2);
      }
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to select first data from db with condition
async function selectFirstDataCondition(fields, from, where1, where2) {
  return new Promise(async function (resolve, reject) {
    try {
      const data = await knex
        .select(fields)
        .from(from)
        .where(where1)
        .orWhere(where2)
        .first();
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to select all data from db
async function selectAllData(fields, from, where = {}) {
  return new Promise(async function (resolve, reject) {
    try {
      let data;
      if (where) {
        data = await knex.select(fields).from(from).where(where);
      } else {
        data = await knex.select(fields).from(from);
      }

      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to select all data from db
async function selectAllDataCondition(fields, from, where, where2) {
  return new Promise(async function (resolve, reject) {
    try {
      let data;
      if (where) {
        data = await knex
          .select(fields)
          .from(from)
          .where(where)
          .andWhere(where2);
      } else {
        data = await knex.select(fields).from(from);
      }

      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to insert data in db
async function insertData(data, fields, table) {
  return new Promise(async function (resolve, reject) {
    try {
      const query = await knex.insert(data).into(table);
      const result = await query;

      // Retrieve the inserted row
      const insertedRow = await knex
        .from(table)
        .select(fields)
        .where({ id: result[0] });
      return resolve(insertedRow);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update data in db
async function updateData(data, fields, table, where) {
  return new Promise(async function (resolve, reject) {
    try {
      const query = await knex.update(data).into(table).where(where);
      const result = await query;

      // Retrieve the affected rows
      const affectedRows = await knex.from(table).where(where).select(fields);

      return resolve(affectedRows);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update data in db with condition
async function updateDataCondition(data, fields, table, where1, where2) {
  return new Promise(async function (resolve, reject) {
    try {
      const query = await knex
        .update(data)
        .into(table)
        .where(where1)
        .orWhere(where2);
      const result = await query;

      // Retrieve the affected rows
      const affectedRows = await knex
        .from(table)
        .where(where1)
        .orWhere(where2)
        .select(fields);

      return resolve(affectedRows);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to delete data from db
async function deleteData(table, fields, where, where2) {
  return new Promise(async function (resolve, reject) {
    try {
      let affectedRows;
      const query = knex.from(table).where(where).del();
      const result = await query;

      // Retrieve the affected rows
      affectedRows = await knex.from(table).where(where).select(fields);

      if (where2) {
        affectedRows = await knex
          .from(table)
          .where(where)
          .andWhere(where2)
          .select(fields);
      }

      return resolve(affectedRows);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to select all data with join from db
async function selectAllDataJoin(
  joinTable,
  firstCond,
  operator,
  secondCond,
  firstField,
  secondField,
  from,
  where = {}
) {
  return new Promise(async function (resolve, reject) {
    try {
      let data;
      if (where) {
        data = await knex
          .join(joinTable, firstCond, operator, secondCond)
          .select(firstField, secondField)
          .from(from)
          .where(where);
      } else {
        data = await knex
          .join(joinTable, firstCond, operator, secondCond)
          .select(firstField, secondField)
          .from(from);
      }
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to select all data with join from db
async function selectAllDataMultipleJoin(joins, fields, from, where = {}) {
  return new Promise(async function (resolve, reject) {
    try {
      let query = knex.select(...fields).from(from);

      if (Array.isArray(joins)) {
        for (const join of joins) {
          query = query.leftJoin(join.joinTable, function () {
            this.on(
              knex.raw(join.firstCond),
              join.operator,
              knex.raw(join.secondCond)
            ).andOnNotNull(join.secondCond);
          });
        }
      }

      if (where) {
        query = query.where(where);
      }

      const data = await query;
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}
