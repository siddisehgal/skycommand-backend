const mongoose = require('mongoose');

async function connectDatabase() {
  const dbUrl = process.env.DB_URL;

  if (!dbUrl) {
    console.log('DB_URL not set, using in-memory mock data only');
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(dbUrl, {
      autoIndex: true
    });

    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.warn(`MongoDB connection failed, continuing with mock data: ${error.message}`);
    return null;
  }
}

module.exports = { connectDatabase };
