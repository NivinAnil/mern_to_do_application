const mongoose = require('mongoose');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required');
}

let cached = globalThis._mongoose;

async function connectToDatabase() {
  if (cached && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!cached) {
    cached = { conn: null, promise: null };
    globalThis._mongoose = cached;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m;
    }).catch(error => {
      console.log("Error connecting to database",error.message)
    });
    
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectToDatabase };
