const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Book = sequelize.define("book", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  publisher: DataTypes.STRING,
  author: DataTypes.STRING,
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  available: {
    type: DataTypes.BOOLEAN,
    default: true,
    allowNull: false,
  },
});

/**
  Yes, a string field can be a primary key in an SQL table. However, it's usually recommended to use integer primary keys because they're the fastest way to determine relations. For example, searching an index for an integer value is much faster than searching for a string. 
A primary key can be any data type as long as the key or records in question are unique. Some circumstances when it's good to use a string primary key include: 
The string key is not a field in any other table.
The string is a UUID or GUID that is time-sorted, so all new records go to the end of the table.
From a performance standpoint, using strings for primary keys are slower than integers. This depends on the size of the table and the length of the string. Longer strings are harder to compare. 
In MySQL, you can't use a text field as an auto-increment primary key. Auto-incrementing primary keys must be of numeric data types such as INT or BIGINT
 */

module.exports = Book;
