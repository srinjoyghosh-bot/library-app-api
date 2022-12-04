const Sequelize = require("sequelize");

// const sequelize = new Sequelize("library-management", "root", "srinjoymysql", {
//   dialect: "mysql",
//   host: "localhost",
// });
// const sequelize = new Sequelize("freedb_library-management", "freedb_dada_joy", "EWbfDyBmWsH7$!y", {
//   dialect: "mysql",
//   host: "sql.freedb.tech",
  
// });
require('dotenv').config()
const sequelize = new Sequelize("BYWY12SiJV", process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: "mysql",
  host: "remotemysql.com",
  
});

module.exports = sequelize;
