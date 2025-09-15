const mongoose = require('mongoose');
require("dotenv").config();

// Cache the connection to avoid multiple connections in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Simple database connection function
async function connectToDatabase() {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      return mongoose;
    }

    // Use cached connection if available
    if (cached.conn) {
      console.log('Using cached MongoDB connection');
      return cached.conn;
    }

    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    console.log('Connecting to MongoDB...');
    
    // Use cached promise if available
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferCommands: false, // Disable mongoose buffering
        bufferMaxEntries: 0 // Disable mongoose buffering
      }).then(mongoose => {
        console.log('Successfully connected to MongoDB');
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
}

module.exports = { connectToDatabase };