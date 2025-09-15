// Main API handler for Vercel (Backend Only)
const { connectToDatabase } = require('../src/utils/mongo');
const app = require('../src/app');

module.exports = async (req, res) => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error('Error in Vercel handler:', error);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Database connection failed', 
        error: 'Please try again later',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};
