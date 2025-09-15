const mongoose = require('mongoose');
require("dotenv").config();
// Simple database connection function
async function connectToDatabase() {
try {
// Check if already connected
if (mongoose.connection.readyState === 1) {
console.log('Already connected to MongoDB');
return mongoose;
 }
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
throw new Error('MONGODB_URI environment variable is required');
 }
console.log('Connecting to MongoDB...');
await mongoose.connect(MONGODB_URI, {
useNewUrlParser: true,
useUnifiedTopology: true,
 });
console.log('Successfully connected to MongoDB');
return mongoose;
 } catch (error) {
console.error('Error connecting to MongoDB:', error.message);
throw error;
 }
}
module.exports = { connectToDatabase };