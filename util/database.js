const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("library-management", "root", "srinjoymysql", {
//   dialect: "mysql",
//   host: "localhost",
// });
require("dotenv").config();
// const sequelize = new Sequelize("freedb_library_db", process.env.DB_USER, "Qc7Zv**6B!#aYE#", {
//   dialect: "mysql",
//   host: "sql.freedb.tech",

// });
// const sequelize = new Sequelize("sql11672947", "sql11672947", "Q9Ct3J6FAu", {
//   dialect: "mysql",
//   host: "sql11.freemysqlhosting.net",

// });
const sequelize = new Sequelize(
  "defaultdb",
  "avnadmin",
  "AVNS_xVIdckNs3OJFNcL6QEq",
  {
    dialect: "mysql",
    host: "lib-2c3c758-srinjoygh-7d67.a.aivencloud.com",
    port:26514,
  }
);
// require('dotenv').config()
// const sequelize = new Sequelize("BYWY12SiJV", process.env.DB_USER, process.env.DB_PASSWORD, {
//   dialect: "mysql",
//   host: "remotemysql.com",

// });

module.exports = sequelize;
