const express = require("express");
const {
  protectMiddleware,
  authorizeMiddleware,
} = require("../middleware/protectMiddleware");
const {
  getBooks,
  getBook,
  setBook,
  uploadBookPhoto,
  getCategorieBooks,
  updateBook,
} = require("../controller/bookController");

const router = express.Router();

router
  .route("/")
  .get(getBooks)
  .post(protectMiddleware, authorizeMiddleware("operator", "admin"), setBook);
router
  .route("/:id")
  .get(getBook)
  .put(protectMiddleware, authorizeMiddleware("operator", "admin"), updateBook);

router
  .route("/:id/photo")
  .put(
    protectMiddleware,
    authorizeMiddleware("operator", "admin"),
    uploadBookPhoto
  );

module.exports = router;
