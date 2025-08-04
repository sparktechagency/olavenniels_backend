// config/db.js
// This file is used to connect to the MongoDB database
const mongoose =  require( "mongoose");
const logger = require( "../utils/logger.js");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Exit on failure
  }
};

module.exports = connectDB;
