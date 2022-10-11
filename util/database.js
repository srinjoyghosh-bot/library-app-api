const Sequelize = require("sequelize");

const sequelize = new Sequelize("library-management", "root", "srinjoymysql", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
