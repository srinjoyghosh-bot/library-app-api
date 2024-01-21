const jwt = require("jsonwebtoken");
require("dotenv").config()
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    console.log(process.env.JWT_SECRET_KEY);
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken || !decodedToken.enrollment) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }  
  req.enrollment = decodedToken.enrollment; 
  req.isAuth = true;
  next();
};
