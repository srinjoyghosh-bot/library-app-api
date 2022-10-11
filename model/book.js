const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Book = sequelize.define("book", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  publisher:Sequelize.STRING,
  image_url:{
    type:Sequelize.STRING,
    allowNull:true,
  },
  available: {
    type: Sequelize.BOOLEAN,
    default: true,
    allowNull:false,
  },
});

module.exports = Book;
