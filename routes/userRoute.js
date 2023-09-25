const express = require("express");

const {
  userRegister,
  userLogin,
  getUsers,
} = require("../controller/userController");
const { getUserBooks } = require("../controller/bookController");
const {
  protectMiddleware,
  authorizeMiddleware,
} = require("../middleware/protectMiddleware");
const router = express.Router();

router
  .route("/")
  .post(protectMiddleware, authorizeMiddleware("admin"), userRegister)
  .get(protectMiddleware, authorizeMiddleware("admin"), getUsers);
router
  .route("/:id/books")
  .get(
    protectMiddleware,
    authorizeMiddleware("admin", "operator"),
    getUserBooks
  );
router.route("/login").post(userLogin);

module.exports = router;
