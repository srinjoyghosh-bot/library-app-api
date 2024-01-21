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
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    // console.log("error yha h 500");
    err.statusCode = 500;
    throw err;
  }
  // console.log(decodedToken);
  if (!decodedToken || !decodedToken.email) {
    // console.log("error yha h 401");
    const error = new Error("Not authenticated");
    err.statusCode = 401;
    throw error;
  }  
  req.adminEmail = decodedToken.email; 
  req.isAdmin = true;
  next();
};
