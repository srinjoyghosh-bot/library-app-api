const express = require("express");
const bookController = require("../controller/book");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/add",
  [
    body("name").trim().not().isEmpty(),
    body("description").trim().not().isEmpty(),
    body("publisher").trim().not().isEmpty(),
  ],
  bookController.addBook
);
router.post(
  "/issue",
  [
    body("student_id").trim().not().isEmpty().isDecimal(),
    body("book_id").trim().not().isEmpty().isDecimal(),
  ],
  bookController.borrowBook
);
router.put(
  "/return",
  [
    body("student_id").trim().not().isEmpty().isDecimal(),
    body("book_id").trim().not().isEmpty().isDecimal(),
  ],
  bookController.returnBook
);
router.get("/", bookController.findAllBooks);
router.get(
  "/find",
  [body("id").trim().not().isEmpty().isDecimal()],
  bookController.findBook
);
router.get("/find-by-name", bookController.findBookByName);
router.delete("/delete", bookController.deleteBook);
router.put("/toggle-availability", bookController.toggleAvailability);
module.exports = router;
