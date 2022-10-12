const express = require("express");
const studentController = require("../controller/student");
const router = express.Router();

router.post("/add", studentController.addStudent);

router.get("/find", studentController.findStudent);

router.get("/history", studentController.getBorrowHistory);

module.exports = router;
