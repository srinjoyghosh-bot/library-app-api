const express = require("express");
const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const Student = require("./model/student");
const Borrow = require("./model/borrow");
const studentRoutes = require("./routes/student");
const bookRoutes = require("./routes/book");
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/student", studentRoutes);
app.use("/book", bookRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message,
    data: err.data,
  });
});

Student.hasMany(Borrow, {
  foreignKey: "student_id",
});
Borrow.belongsTo(Student);

sequelize
  .sync()
  .then((result) => {
    app.listen(8080);
  })
  .catch((error) => {
    console.log(error);
  });
