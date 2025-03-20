const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to database");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Error connecting to database: ", err);
    });

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error("Error connecting to database: ", err);
    process.exit(1);
  }
};

module.exports = connectDb;
