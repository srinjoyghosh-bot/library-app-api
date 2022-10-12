const Book = require("../model/book");
const Borrow = require("../model/borrow");
const Student = require("../model/student");

const throwError = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};

exports.findAllBooks = async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.status(200).json({
      books: books,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.findBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({
      where: {
        id: req.body.id,
      },
    });
    if (!book) {
      return res.status(404).json({
        message: "Book not found!",
      });
    }
    res.status(200).json({
      book: book,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.addBook = async (req, res, next) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const publisher = req.body.publisher;
    const imageUrl = req.body.image;
    const book = await Book.create({
      name: name,
      description: description,
      publisher: publisher,
      image_url: imageUrl,
      available: true,
    });
    res.status(200).json({
      message: "Book added !",
      book: book,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.borrowBook = async (req, res, next) => {
  try {
    const bookId = req.body.book_id;
    const studentId = req.body.student_id;
    const student = await Student.findByPk(studentId);
    const borrow = await Borrow.create({
      student_id: studentId,
      book_id: bookId,
    });
    borrow.setStudent(student);
    res.status(200).json({
      message: "Book Issued!",
      issue_details: borrow,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.returnBook = async (req, res, next) => {
  const bookId = req.body.book_id;
  const studentId = req.body.student_id;
  try {
    const date = new Date();
    const result = await Borrow.update(
      {
        return_date: date,
      },
      {
        where: {
          student_id: studentId,
          book_id: bookId,
        },
      }
    );
    if (result[0] === 1) {
      return res.status(200).json({
        message: "Book returned!",
        result: result,
      });
    }
    res.status(401).json({
      message: "Book return failed!",
    });
  } catch (error) {
    throwError(error, next);
  }
};
