const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { MONGO_URI, MONGO_DB_NAME } = process.env;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: MONGO_DB_NAME, autoIndex: true });
    console.log('Database connection successfully');
  } catch (err) {
    console.error('Error at database connection');
    console.error(err);
  }
}

module.exports = connectDB;