const Student = require("../model/student");
const Borrow = require("../model/borrow");
const { validationResult } = require("express-validator");
const differenceInDays = require("date-fns/differenceInDays");
const { fi } = require("date-fns/locale");

const finePerDay = 10;

const throwError = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};

const checkBodyData = (req, next) => {
  const errors = validationResult(req).errors;
  if (errors.length !== 0) {
    const error = new Error("Validation failed,entered data is incorrect");
    error.statusCode = 422;
    error.data = errors;
    next(error);
  }
};

exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.findAll();
    return res.status(200).json({
      students: students,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.findStudent = async (req, res, next) => {
  checkBodyData(req, next);
  const id = req.body.id;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({
        message: "Student not found!",
      });
    }
    res.status(200).json({
      message: "Student found!",
      student: student,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.addStudent = async (req, res, next) => {
  checkBodyData(req, next);
  const enrollment = req.body.id;
  const name = req.body.name;
  const branch = req.body.branch;
  const degree = req.body.degree;
  const year = req.body.year;
  const image = req.body.image;
  try {
    const [student, created] = await Student.findOrCreate({
      where: {
        enrollment_id: enrollment,
      },
      defaults: {
        name: name,
        branch: branch,
        degree: degree,
        year: year,
        image_url: image,
      },
    });
    if (created) {
      return res.status(200).json({
        message: "Student created",
        created: true,
        student: student,
      });
    }
    res.status(200).json({
      message: "Student already created",
      created: false,
      student: student,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.getBorrowHistory = async (req, res, next) => {
  // checkBodyData(req, next);
  const studentId = req.query.id;
  if (!studentId) {
    return res.status(401).json({
      message: "please provide an id",
    });
  }
  try {
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    const history = await student.getBorrows();
    let fine = 0;
    history.forEach((borrow) => {
      if (borrow.return_date) {
        let diffInDays = differenceInDays(
          new Date(borrow.return_date),
          new Date(borrow.createdAt)
        );
        if (diffInDays > 7) {
          fine += finePerDay * (diffInDays - 7);
        }
      }
    });
    res.status(200).json({
      fine: fine,
      history: history,
    });
  } catch (error) {
    throwError(error, next);
  }
};
