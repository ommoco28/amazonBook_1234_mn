const userSchema = require("../models/userSchema.js");
const MyError = require("../utils/myError.js");
const asyncHandler = require("express-async-handler");

exports.userRegister = asyncHandler(async (req, res, next) => {
  const user = await userSchema.create(req.body);

  const token = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    user: user,
    token,
    message: "амжилттай бүртгэсэн",
  });
});

exports.userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new MyError("мэйл нууц үгээ оруулна уу", 400);
  }

  const user = await userSchema.findOne({ email }).select("+password");

  if (!user) {
    throw new MyError("мэйл эсвэл нууц үг буруу байна", 401);
  }

  if (!(await user.checkPassword(password))) {
    throw new MyError("мэйл эсвэл нууц үг буруу байна", 401);
  }
  
  res.status(200).json({
    success: true,
    token: user.getJsonWebToken(),
    user: user,
  });
});
