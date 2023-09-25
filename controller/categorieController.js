const categorieSchema = require("../models/categorieSchema");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

exports.getCategories = asyncHandler(async (req, res, next) => {
  const select = req.query.select;
  const sort = req.query.sort;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, categorieSchema);

  const categories = await categorieSchema
    .find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
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
  const categorie = await categorieSchema
    .findById(req.params.id)
    .populate("books");
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
    const categorie = await categorieSchema.create(req.body);
    res.status(200).json({
      success: true,
      data: categorie,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategorie = asyncHandler(async (req, res, next) => {
  const categorie = await categorieSchema.findById(req.params.id);
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
