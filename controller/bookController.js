const BookSchema = require("../models/bookSchema.js");
const MyError = require("../utils/myError.js");
const asyncHandler = require("express-async-handler");
const CategoriesSchema = require("../models/categorieSchema.js");

exports.getBooks = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.categoryId) {
    query = BookSchema.find({ category: req.params.categoryId });
  } else {
    query = BookSchema.find().populate({
      path: "category",
      select: "name averagePrice",
    });
  }

  const books = await query;

  if (!books) {
    throw new MyError("Ном байхгүй байна", 400);
  }
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

exports.getBook = async (req, res, next) => {
  try {
    const book = await BookSchema.findById(req.params.id);
    if (!book) {
      throw new MyError("ном байхгүй байна", 400);
    }
    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (err) {
    next(err);
  }
};
exports.setBook = async (req, res, next) => {
  try {
    const categorie = await CategoriesSchema.findById(req.body.category);

    if (!categorie) {
      throw new MyError("катигори байхгүй байна", 400);
    }
    const book = await BookSchema.create(req.body);
    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (err) {
    next(err);
  }
};
// PUT: /api/v1/books/:bookId/photo
exports.uploadBookPhoto = asyncHandler(async (req, res, next) => {
  const book = await BookSchema.findById(req.params.id);

  if (!book) {
    throw new MyError(req.params.id + "id ном байхгүй байн", 400);
  }

  let file = req.files;
  let image = file.mimetype;
  console.log(image);
  // if (ima) {
  //   throw new MyError("зураг оруулах хийнэ үү", 400);
  // }
  console.log(file);
  res.end();
  // res.status(200).json({
  //   success: true,
  //   data: book,
  // });
});
