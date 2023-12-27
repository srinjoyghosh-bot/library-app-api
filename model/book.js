const {DataTypes} = require("sequelize");
const sequelize = require("../util/database");

const Book = sequelize.define("book", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  publisher:DataTypes.STRING,
  author:DataTypes.STRING,
  image_url:{
    type:DataTypes.STRING,
    allowNull:true,
  },
  available: {
    type: DataTypes.BOOLEAN,
    default: true,
    allowNull:false,
  },
});

module.exports = Book;
