const express = require("express");

const booksRoutes = require("./bookRoute");

const {
  getCategories,
  getCategorie,
  setCategorie,
  deleteCategorie,
  updateCategorie,
} = require("../controller/categorieController");

const router = express.Router();

router.route("/").get(getCategories).post(setCategorie);
router
  .route("/:id")
  .get(getCategorie)
  .put(updateCategorie)
  .delete(deleteCategorie);

router.use("/:categoryId/books", booksRoutes);
module.exports = router;
