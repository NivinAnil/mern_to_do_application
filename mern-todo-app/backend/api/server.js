const app = require('../src/app');             
const { connectToDatabase } = require('../src/utils/mongo'); 

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (err) {
    console.error('Error in serverless wrapper:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};
