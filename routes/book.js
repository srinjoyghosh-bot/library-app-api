const express = require("express");
const bookController = require("../controller/book");
const { body } = require("express-validator");
const isAuth = require("../middleware/is_auth.js");
const isAdmin = require("../middleware/is_admin.js");
const router = express.Router();

router.post(
  "/add",
  [
    body("name").trim().not().isEmpty(),
    body("description").trim().not().isEmpty(),
    body("publisher").trim().not().isEmpty(),
    body("author").trim().not().isEmpty(),
  ],
  isAdmin,
  bookController.addBook
);

router.put(
  "/edit",
  [
    body("id").trim().not().isEmpty()    
  ],
  isAdmin,
  bookController.editBook
);

router.put("/issue", isAdmin, bookController.issueBook);
router.put("/reject-issue", isAdmin, bookController.rejectBookIssue);

router.put(
  "/return",
  [
    body("student_id").trim().not().isEmpty(),
    body("book_id").trim().not().isEmpty(),
  ],
  isAdmin,
  bookController.returnBook
);
router.get("/", bookController.findAllBooks);
router.get("/find", bookController.findBook);
router.get("/find-by-name", bookController.findBookByName);
router.delete("/delete", isAdmin, bookController.deleteBook);
router.post(
  "/add-books-to-algolia",
  isAdmin,
  bookController.addAllBooksToAlgolia
);
router.get("/search/:term", bookController.search);
router.put("/toggle-availability", isAdmin, bookController.toggleAvailability);
module.exports = router;
