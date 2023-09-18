const mongoose = require("mongoose");

const connectDB = async () => {
  const connect = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`mongodb connected : ${connect.connection.host}`);
};

module.exports = connectDB;
