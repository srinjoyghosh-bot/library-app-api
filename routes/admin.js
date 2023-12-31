const express = require("express");
const adminController = require("../controller/admin.js");
const { body } = require("express-validator");
const isAuth = require("../middleware/is_auth.js");
const isAdmin = require("../middleware/is_admin.js");
const router = express.Router();

router.post(
  "/add",
  [
    body("email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("Must be a valid email id"),
    body("password").trim().isLength({
      max: 8,
      min: 8,
    }).withMessage("Password must be 8 characters long"),
  ],
  isAdmin,
  adminController.addAdmin
);

router.post(
    "/login",
    [
      body("email")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("Must be a valid email id"),
      body("password").trim().isLength({
        max: 8,
        min: 8,
      }).withMessage("Password must be 8 characters long"),
    ],
    // isAdmin,
    adminController.adminLogin
  );

  module.exports=router