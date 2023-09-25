const express = require("express");

const {
  userRegister,
  userLogin,
  getUsers,
} = require("../controller/userController");

const router = express.Router();

router.route("/").post(userRegister).get(getUsers);
router.route("/login").post(userLogin);

module.exports = router;
