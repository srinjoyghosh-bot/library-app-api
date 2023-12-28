const { validationResult, check } = require("express-validator");
const Admin = require("../model/admin.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

exports.addAdmin = async (req, res, next) => {
  checkBodyData(req, next);
  try {
    const { email, password } = req.body;
    const hashedPw = await bcrypt.hash(password, SALT_ROUNDS);
    const [admin, created] = await Admin.findOrCreate({
      where: {
        email: email,
      },
      defaults: {
        password: hashedPw,
      },
    });
    if (!created) {
      return res.status(409).json({
        error: "Conflict",
        message: "Email is already an admin",
        admin: admin,
      });
    }
    return res.status(200).json({
      message: "Email made admin",
      admin: admin,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.adminLogin = async (req, res, next) => {
  checkBodyData(req, next);
  const { email, password } = req.body;
  const admin = await Admin.findOne({
    where: {
      email: email,
    },
  });
  if (!admin) {
    return res.status(404).json({
      error: "User not found!",
    });
  }
  const isEqual = await bcrypt.compare(password, admin.password);
  if (!isEqual) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "The provided password is incorrect. Access is denied.",
    });
  }
  const token = jwt.sign(
    {
      email: admin.email,
    },
    "mysecretsecret",
    { expiresIn: "30d" }
  );
  return res.status(200).json({
    message:"Admin logged in!",
    token:token,
  })
};