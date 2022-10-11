const express = require("express");
const bookController = require("../controller/book");

const router = express.Router();

router.post("/add", bookController.addBook);
router.post("/issue", bookController.borrowBook);
router.put("/return", bookController.returnBook);
router.get("/", bookController.findAllBooks);
router.get("/find", bookController.findBook);
module.exports = router;
