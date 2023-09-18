const mongoose = require("mongoose");
const MyError = require("../utils/myError");

const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "номын нэрийг заавал нэр оруулна"],
      unique: true,
      trim: true,
      maxlength: [250, "250 тэмдэгт байх ёстой"],
    },
    author: {
      type: String,
      required: [true, "Зохиогчийн нэр оруулна уу"],
      trim: true,
      maxlength: [50, "50 тэмдэгт байна"],
    },
    price: {
      type: Number,
      required: [true, "Номын үнийг оруулна уу"],
      min: [500, "хамгийн багадаа 500 байх ёстой"],
    },
    balance: Number,
    bestseller: {
      type: Boolean,
      default: false,
    },
    availably: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "categorieSchema",
      required: true,
    },
    content: {
      type: String,
      required: [true, "тайлбар оруулах ёстой"],
      maxlength: [5000, "5000 тэмдэгт байх ёстой"],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    rating: {
      type: Number,
      min: [1, "хамгийн багадаа 1 байх ёстой"],
      max: [10, "хамгийн ихдээ 10 байх ёстой"],
    },
    averagePrice: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
bookSchema.statics.computeBookAveragePrice = async function (catId) {
  const obj = await this.aggregate([
    {
      $match: { category: catId },
    },
    {
      $group: { _id: "$category", avgPrice: { $avg: "$price" } },
    },
  ]);

  // console.log(obj);

  let avgPrice = null;
  if (obj.length > 0) avgPrice = obj[0].avgPrice;

  const tempModel = await this.model("categorieSchema").findOneAndUpdate(
    catId,
    {
      averagePrice: avgPrice,
    }
  );
  return obj;
};
bookSchema.post("save", function () {
  this.constructor.computeBookAveragePrice(this.category);
});
bookSchema.pre("deleteOne", { document: true }, function () {
  this.constructor.computeBookAveragePrice(this.category);
});
bookSchema.virtual("zohiogch").get(function () {
  let tokens = this.author.split(" ");
  if (tokens.length === 1) tokens = this.author.split(".");
  if (tokens.length === 2) return tokens[1];

  return tokens[0];
});
module.exports = mongoose.model("bookSchema", bookSchema);
