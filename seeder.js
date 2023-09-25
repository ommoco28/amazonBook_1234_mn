const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/categorieSchema");
const Book = require("./models/bookSchema");
const User = require("./models/userSchema");

dotenv.config({ path: "./config/.env" });

const connectDB = async () => {
  const connect = await mongoose.connect(process.env.MONGODB_URI, {});
};

connectDB();

const categories = JSON.parse(
  fs.readFileSync(__dirname + "/data/categories.json", "utf-8")
);
const books = JSON.parse(
  fs.readFileSync(__dirname + "/data/books.json", "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(__dirname + "/data/users.json", "utf-8")
);
const importData = async () => {
  try {
    await Category.create(categories);
    await Book.create(books);
    await User.create(users);
    console.log("import success");
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    await Category.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();
    console.log("delete successI");
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
