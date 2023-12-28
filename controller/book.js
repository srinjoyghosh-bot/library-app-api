const generateUniqueId = require("generate-unique-id");
const Book = require("../model/book");
const Borrow = require("../model/borrow");
const Student = require("../model/student");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

// const Op = Sequelize.Op;

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

const generateId = () => {
  return generateUniqueId({ length: 6, includeSymbols: false });
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
        id: req.query.id,
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

exports.findBookByName = async (req, res, next) => {
  try {
    const books = await Book.findAll({
      where: {
        name: {
          [Op.like]: "%" + req.query.name + "%",
        },
      },
    });
    if (!books) {
      return res.status(404).json({
        message: "No book found",
      });
    }
    res.status(200).json({
      books: books,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.addBook = async (req, res, next) => {
  checkBodyData(req, next);
  try {
    const name = req.body.name;
    const description = req.body.description;
    const publisher = req.body.publisher;
    const author = req.body.author;
    const imageUrl = req.body.image;
    const id = generateId();
    const book = await Book.create({
      id: id,
      name: name,
      description: description,
      publisher: publisher,
      author: author,
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

exports.deleteBook = async (req, res, next) => {
  const id = req.query.id;
  if (!id) {
    return res.status(401).json({
      message: "Please provide a book id",
    });
  }

  try {
    const rowsDeleted = await Book.destroy({
      where: {
        id: id,
      },
    });
    if (rowsDeleted === 1) {
      return res.status(200).json({
        message: "Book deleted!",
      });
    } else {
      return res.status(404).json({
        message: "No book found!",
      });
    }
  } catch (error) {
    throwError(error, next);
  }
};

exports.issueBook = async (req, res, next) => {
  checkBodyData(req, next);
  try {
    const borrowId = req.body.borrowId;
    const borrowRequest = await Borrow.findByPk(borrowId);
    if (!borrowRequest || borrowRequest.return_date !== null || borrowRequest.status!="pending") {
      return res.status(401).json({
        message: "Book was not available for issue",
      });
    }
    const result = await Book.update(
      {
        available: false,
      },
      {
        where: {
          id: borrowRequest.book_id,
        },
      }
    );
    if (result[0] !== 1) {
      return res.status(401).json({
        message: "Book issue failed!",
        result: result,
      });
    }

    result = await Borrow.update(
      {
        status: "approved",
      },
      {
        where: {
          id: borrowId,
        },
      }
    );
    if (result[0] !== 1) {
      return res.status(401).json({
        message: "Book issue failed!",
        result: result,
      });
    }

    res.status(200).json({
      message: "Book Issued!",
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.rejectBookIssue = async (req, res, next) => {
  checkBodyData(req, next);
  try {
    const borrowId = req.body.borrowId;
    const borrowRequest = await Borrow.findByPk(borrowId);
    if (!borrowRequest || borrowRequest.return_date !== null || borrowRequest.status!="pending") {
      return res.status(401).json({
        message: "Book was not available for issue",
      });
    }
    const result = await Borrow.update(
      {
        status: "rejected",
      },
      {
        where: {
          id: borrowId,
        },
      }
    );
    if (result[0] !== 1) {
      return res.status(401).json({
        message: "Book issue rejection failed!",
        result: result,
      });
    }
    res.status(200).json({
      message: "Book Issue rejected!",
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.toggleAvailability = async (req, res, next) => {
  const id = req.query.id;
  if (!id) {
    return res.status(401).json({
      message: "Please provide a book id",
    });
  }
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({
        message: "No book found",
      });
    }
    book.available = !book.available;
    const result = await book.save();
    return res.status(200).json({
      message: "Book saved!",
      result: result,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.returnBook = async (req, res, next) => {
  checkBodyData(req, next);
  const borrowId = req.body.borrowId;
  try {
    const date = new Date();
    const borrow = await Borrow.findByPk(borrowId);    
    
    if (!borrow || borrow.return_date !== null || borrow.status!="approved") {
      return res.status(401).json({
        message: "Book was not available for issue",
      });
    }

    const bookUpdate = await Book.update(
      {
        available: true,
      },
      {
        where: {
          id: borrow.book_id,
        },
      }
    );
    if (bookUpdate[0] !== 1) {
      return res.status(401).json({
        message: "Book return failed!",
      });
    }
    const result = await Borrow.update(
      {
        return_date: date,
      },
      {
        where: {
          id:borrowId
        },
        order: [["id", "DESC"]],
      }
    );
    if (result[0] !== 1) {
      const bookUpdate = await Book.update(
        {
          available: false,
        },
        {
          where: {
            id: borrow.book_id,
          },
        }
      );
      return res.status(401).json({
        message: "Book return failed!",
      });
    }
    res.status(200).json({
      message: "Book returned!",
      result: result[1],
    });
  } catch (error) {
    throwError(error, next);
  }
};
