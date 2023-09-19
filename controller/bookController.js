const BookSchema = require("../models/bookSchema.js");
const MyError = require("../utils/myError.js");
const asyncHandler = require("express-async-handler");
const CategoriesSchema = require("../models/categorieSchema.js");
const path = require("path");

exports.getBooks = asyncHandler(async (req, res, next) => {
  let query;



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

  let image = JSON.parse(JSON.stringify(req.files));

  if (!req.files.file.mimetype.startsWith("image")) {
    throw new MyError("та зураг upload хийнэ үү", 400);
  }

  if (req.files.file.size > process.env.MAX_UPLOAD_FILE_SIZE * 1024 * 1024) {
    throw new MyError("таны зурагны хэмжээ хэтэрсэн байна", 400);
  }

  let fileName = `photo_${req.params.id}${path.parse(req.files.file.name).ext}`;

  req.files.file.mv(`./${process.env.FILE_UPLOAD_PATH}/${fileName}`, (err) => {
    if (err) {
      throw new MyError("файлыг хуулахад алдаа гарсан : " + err.message, 400);
    }
  });
  book.photo = fileName;
  book.save();
  res.status(200).json({
    success: true,
    data: fileName,
  });
});
