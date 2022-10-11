const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Borrow = sequelize.define(
  "borrow",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    student_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    return_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  }
);

module.exports = Borrow;
