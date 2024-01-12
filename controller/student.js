const Student = require("../model/student");
const Book = require("../model/book");
const Borrow = require("../model/borrow");
const { validationResult } = require("express-validator");
const differenceInDays = require("date-fns/differenceInDays");
const { fi } = require("date-fns/locale");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {studentIndex} = require("../util/algolia");

const FINE_PER_DAY = 10;
const SALT_ROUNDS = 12;

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

const getStudentBorrowHistory = async (student) => {
  const history = await student.getBorrows();
  let fine = 0;
  history.forEach((borrow) => {
    if (borrow.return_date) {
      let diffInDays = differenceInDays(
        new Date(borrow.return_date),
        new Date(borrow.createdAt)
      );
      if (diffInDays > 7) {
        fine += FINE_PER_DAY * (diffInDays - 7);
      }
    }
  });
  return {
    fine: fine,
    history: history,
  };
};

exports.getAllStudents = async (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(401).json({
      error: "Unauthenticated",
      message: "Only admin can perform this action",
    });
  }
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
  if (!req.isAdmin) {
    return res.status(401).json({
      error: "Unauthenticated",
      message: "Only admin can perform this action",
    });
  }
  try {
    const id = req.body.id;
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

exports.search = async (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(401).json({
      error: "Unauthenticated",
      message: "Only admin can perform this action",
    });
  }
  try {
    const term=req.params.term
    const search=await studentIndex.search(term)
    return res.status(200).json({
      students:search.hits
    })
  } catch (error) {
    console.log(error);
    throwError(error,next)
  }
};

exports.addAllStudentsToAlgolia = async (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(401).json({
      error: "Unauthenticated",
      message: "Only admin can perform this action",
    });
  }
  try {
    const students = await Student.findAll();
    let updatedStudents=students.map((student) => {
      return {...student.dataValues,objectID:student.enrollment_id}
    });
    console.log(updatedStudents);
    await studentIndex.saveObjects(updatedStudents)
    return res.sendStatus(200)
  } catch (error) {
    console.log(error);
    throwError(error,next)
  }
  
};

exports.addStudent = async (req, res, next) => {
  checkBodyData(req, next);
  const enrollment = req.body.id;
  const password = req.body.password;
  const name = req.body.name;
  const branch = req.body.branch;
  const degree = req.body.degree;
  const year = req.body.year;
  const image = req.body.image;
  const hashedPw = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const [student, created] = await Student.findOrCreate({
      where: {
        enrollment_id: enrollment,
      },
      defaults: {
        password: hashedPw,
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
    res.status(409).json({
      error: "Conflict",
      message: "Student already exists",
      created: false,
      student: student,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.studentLogin = async (req, res, next) => {
  checkBodyData(req, next);
  try {
    const { id, password } = req.body;
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({
        message: "Student not found!",
      });
    }
    const studentPw = student.password;
    const isEqual = await bcrypt.compare(password, studentPw);
    if (!isEqual) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "The provided password is incorrect. Access is denied.",
      });
    }
    const token = jwt.sign(
      {
        enrollment: student.enrollment_id,
      },
      "mysecretsecret",
      { expiresIn: "30d" }
    );
    res.status(200).json({
      message: "Successfully logged in!",
      token: token,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.borrowRequest = async (req, res, next) => {
  checkBodyData(req, next);
  try {
    const bookId = req.body.book_id;
    const studentId = req.enrollment;
    const student = await Student.findByPk(studentId);
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found!",
      });
    }
    if (!student) {
      return res.status(404).json({
        message: "Student not found!",
      });
    }
    if (!book.available) {
      return res.status(401).json({
        message: "Book not available",
      });
    }
    const result = await Book.update(
      {
        available: false,
      },
      {
        where: {
          id: bookId,
        },
      }
    );
    if (result[0] !== 1) {
      return res.status(401).json({
        message: "Book issue failed!",
        result: result,
      });
    }
    const borrow = await Borrow.create({
      student_id: studentId,
      book_id: bookId,
    });
    borrow.setStudent(student);
    res.status(200).json({
      message: "Borrow request sent!",
      issue_details: borrow,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.getSelfProfile = async (req, res, next) => {
  const enrollment = req.enrollment;
  try {
    const student = await Student.findByPk(enrollment);
    const result = await getStudentBorrowHistory(student);
    return res.status(200).json({
      student: student,
      borrow: result,
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
  if (!req.isAdmin) {
    return res.status(401).json({
      error: "Unauthenticated",
      message: "Only admin can perform this action",
    });
  }
  try {
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    // const history = await student.getBorrows();
    // let fine = 0;
    // history.forEach((borrow) => {
    //   if (borrow.return_date) {
    //     let diffInDays = differenceInDays(
    //       new Date(borrow.return_date),
    //       new Date(borrow.createdAt)
    //     );
    //     if (diffInDays > 7) {
    //       fine += FINE_PER_DAY * (diffInDays - 7);
    //     }
    //   }
    // });
    const result = await getStudentBorrowHistory(student);
    res.status(200).json(result);
  } catch (error) {
    throwError(error, next);
  }
};
