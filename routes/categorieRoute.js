const express = require("express");

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

const { getCategorieBooks } = require("../controller/bookController");
router.route("/:categoryId/books").get(getCategorieBooks);
module.exports = router;
