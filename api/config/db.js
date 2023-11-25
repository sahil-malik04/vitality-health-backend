const knex = require("knex");

const db = knex({
  client: "mysql",
  connection: {
    host: process.env.SQLHOST,
    user: process.env.SQLUSER,
    password: process.env.SQLPASSWORD,
    database: process.env.SQLDATABASE,
    port: 3306,
  },
});

module.exports = db;
