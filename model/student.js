const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Student = sequelize.define("student", {
  enrollment_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  branch: Sequelize.STRING,
  year: Sequelize.INTEGER,
  degree: Sequelize.STRING,
  image_url: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports=Student;
