const categorieSchema = require("../models/categorieSchema");
const CategoriesSchema = require("../models/categorieSchema");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");

exports.getCategories = asyncHandler(async (req, res, next) => {
  const select = req.query.select;
  const sort = req.query.sort;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const total = await CategoriesSchema.countDocuments();
  const pageCount = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  let end = start + limit - 1;
  if (end > total) end = total;
  const pagination = { total, pageCount, start, end };
  if (page < pageCount) pagination.nextPage = page + 1;
  if (page > 1) pagination.prevPage = page - 1;

  const categories = await CategoriesSchema.find(req.query, select)
    .sort(sort)
    .skip(start - 1)
    .limit(limit);
  if (!categories) {
    throw new MyError("Катигори байхгүй байна", 400);
  }

  res.status(200).json({
    success: true,
    data: categories,
    pagination,
  });
});

exports.getCategorie = asyncHandler(async (req, res, next) => {
  const categorie = await CategoriesSchema.findById(req.params.id).populate(
    "books"
  );
  if (!categorie) {
    throw new MyError(req.params.id + "id тай катигори алга!", 400);
  }

  res.status(200).json({
    success: true,
    data: categorie,
  });
});

exports.setCategorie = async (req, res, next) => {
  try {
    const categorie = await CategoriesSchema.create(req.body);
    res.status(200).json({
      success: true,
      data: categorie,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategorie = asyncHandler(async (req, res, next) => {
  const categorie = await CategoriesSchema.findById(req.params.id);
  if (!categorie) {
    throw new MyError("катигори байхгүй байна", 400);
  }
  categorie.deleteOne();

  res.status(200).json({
    success: true,
    data: categorie,
  });
});

exports.updateCategorie = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "катигори засах",
    id: `${req.params.id}`,
  });
};
