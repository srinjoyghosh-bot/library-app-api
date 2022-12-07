const express = require("express");
const studentController = require("../controller/student");
const { body } = require("express-validator");
const router = express.Router();

router.post(
  "/add",
  [
    body("name").trim().not().isEmpty(),
    body("branch").trim().not().isEmpty(),
    body("degree").trim().not().isEmpty(),
    body("id").trim().not().isEmpty().isDecimal(),
    body("year").trim().not().isEmpty().isDecimal(),
  ],
  studentController.addStudent
);

router.get("/get", studentController.getAllStudents);

router.get(
  "/find",
  [body("id").trim().not().isEmpty().isDecimal()],
  studentController.findStudent
);

router.get(
  "/history",
  [body("id").trim().not().isEmpty().isDecimal()],
  studentController.getBorrowHistory
);

module.exports = router;
