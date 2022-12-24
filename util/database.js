const Sequelize = require("sequelize");

// const sequelize = new Sequelize("library-management", "root", "srinjoymysql", {
//   dialect: "mysql",
//   host: "localhost",
// });
require('dotenv').config()
const sequelize = new Sequelize("freedb_library_db", process.env.DB_USER, "Qc7Zv**6B!#aYE#", {
  dialect: "mysql",
  host: "sql.freedb.tech",
  
});
// require('dotenv').config()
// const sequelize = new Sequelize("BYWY12SiJV", process.env.DB_USER, process.env.DB_PASSWORD, {
//   dialect: "mysql",
//   host: "remotemysql.com",
  
// });

module.exports = sequelize;
