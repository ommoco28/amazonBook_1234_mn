const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");

exports.protectMiddleware = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new MyError("энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна", 401);
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    throw new MyError("токен илгээнэ үү", 400);
  }

  const tokenObj = jwt.verify(token, process.env.JWT_SECRET);

  req.userId = tokenObj.id;
  req.userRole = tokenObj.role;
  next();
});

exports.authorizeMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      throw new MyError("эрх хүрэлцэхгүй байна", 403);
    }
    next();
  };
};
