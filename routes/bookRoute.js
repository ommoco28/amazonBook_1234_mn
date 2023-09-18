const express = require("express");

const {
  getBooks,
  getBook,
  setBook,
  uploadBookPhoto,
} = require("../controller/bookController");

const router = express.Router({ mergeParams: true });

router.route("/").get(getBooks).post(setBook);
router.route("/:id").get(getBook);

router.route("/:id/photo").put(uploadBookPhoto);

module.exports = router;
