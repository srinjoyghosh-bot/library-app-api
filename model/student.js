const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../util/database");

const Student = sequelize.define("student", {
  enrollment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  name: DataTypes.STRING,
  branch: DataTypes.STRING,
  year: DataTypes.INTEGER,
  degree: DataTypes.STRING,
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports=Student;
