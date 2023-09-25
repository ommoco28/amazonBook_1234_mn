const BookSchema = require("../models/bookSchema.js");
const MyError = require("../utils/myError.js");
const asyncHandler = require("express-async-handler");
const CategoriesSchema = require("../models/categorieSchema.js");
const path = require("path");
const paginate = require("../utils/paginate.js");

exports.getBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, BookSchema);
  const books = await BookSchema.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  if (!books) {
    throw new MyError("Ном байхгүй байна", 400);
  }
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});
exports.getUserBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, BookSchema);
  req.query.createUser = req.userId;
  const books = await BookSchema.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  if (!books) {
    throw new MyError("Ном байхгүй байна", 400);
  }
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});
exports.getCategorieBooks = asyncHandler(async (req, res, next) => {
  const books = await BookSchema.find({ category: req.params.categoryId });

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

    req.body.createUser = req.userId;


    const book = await BookSchema.create(req.body);
    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateBook = async (req, res, next) => {
  try {
    req.body.updateUser = req.userId;
    const book = await BookSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      throw new MyError("id тэй ном байхгүй байна", 400);
    }

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
