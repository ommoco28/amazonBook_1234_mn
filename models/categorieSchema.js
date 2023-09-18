const mongoose = require("mongoose");
const { slugify } = require("transliteration");
const { Schema } = mongoose;

const categorieSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "заавал нэр оруулна"],
      unique: true,
      trim: true,
      maxlength: [20, "20 тэмдэгт байх ёстой"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "тайлбар оруулах ёстой"],
      maxlength: [500, "500 тэмдэгт байх ёстой"],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    averageRating: {
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

categorieSchema.pre("save", function (next) {
  this.slug = slugify(this.name);

  this.averageRating = Math.floor(Math.random() * 10 + 1);
  // this.averagePrice = Math.floor(Math.random() * 10000 + 3000);

  next();
});
categorieSchema.pre("deleteOne", { document: true }, async function (next) {
  await this.model("bookSchema").deleteMany({ category: this._id });
  next();
});

categorieSchema.virtual("books", {
  ref: "bookSchema",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});

module.exports = mongoose.model("categorieSchema", categorieSchema);
