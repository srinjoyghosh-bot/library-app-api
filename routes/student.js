const express = require("express");
const studentController = require("../controller/student");
const isAuth = require("../middleware/is_auth");
const isAdmin = require("../middleware/is_admin");
const { body } = require("express-validator");
const router = express.Router();

router.post(
  "/add",
  [
    body("name").trim().not().isEmpty(),
    body("id")
      .trim()
      .isNumeric()
      .withMessage("Enrollment must be numeric")
      .isLength({ max: 8, min: 8 })
      .withMessage("Enrollment id must be of 8 digits"),
    body("password")
      .trim()
      .isLength({
        min: 8,
      })
      .withMessage("Password must be at least 8 characters"),
    body("branch").trim().not().isEmpty(),
    body("degree").trim().not().isEmpty(),
    body("year").trim().not().isEmpty().isDecimal(),
  ],
  studentController.addStudent
);

router.post(
  "/login",
  [
    body("enrollment")
      .trim()
      .isNumeric()
      .withMessage("Enrollment must be numeric")
      .isLength({ max: 8, min: 8 })
      .withMessage("Enrollment id must be of 8 digits"),
    body("password")
      .trim()
      .isLength({
        min: 8,
      })
      .withMessage("Password must be at least 8 characters"),
  ],
  studentController.studentLogin
);

router.get("/get", isAdmin, studentController.getAllStudents);

router.get(
  "/find",
  [body("id").trim().not().isEmpty().isDecimal()],
  isAdmin,
  studentController.findStudent
);

router.post(
  "/borrow-request",
  [
    body("book_id").trim().notEmpty().withMessage("Provide valid book id"),
    body("student_id")
      .trim()
      .notEmpty()
      .withMessage("Provide proper student id"),
  ],
  isAuth,
  studentController.borrowRequest
);

router.get(
  "/history",
  // [body("id").trim().not().isEmpty().isDecimal()],
  studentController.getBorrowHistory
);

module.exports = router;
