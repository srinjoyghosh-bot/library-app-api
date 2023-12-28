const jwt = require("jsonwebtoken");
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
    decodedToken = jwt.verify(token, "mysecretsecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken || !decodedToken.email) {
    const error = new Error("Not authenticated");
    err.statusCode = 401;
    throw error;
  }  
  req.adminEmail = decodedToken.email; 
  req.isAdmin = true;
  next();
};
