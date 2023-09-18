const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

const morgan = require("morgan");
const rfs = require("rotating-file-stream");

const errorHandle = require("./middleware/errorMiddleware");

const connectDb = require("./config/db");
const categoriesRoutes = require("./routes/categorieRoute");
const booksRoutes = require("./routes/bookRoute");

const fileupload = require("express-fileupload");

dotenv.config({ path: "./config/.env" });
connectDb();
const app = express();

const stream = rfs.createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "log"),
});
app.use(express.json());
app.use(fileupload());
app.use(morgan("combined", { stream: stream }));
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use(errorHandle);

const server = app.listen(process.env.PORT, () => {
  console.log("MSR running PORT: ", process.env.PORT);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`unhandle rejection ERR : ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
