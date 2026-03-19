const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to KrishiSetu API',
    version: '1.0.0',
    status: 'Server is running'
  });
});

// API Routes (to be added)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/crops', require('./routes/crops'));
// app.use('/api/marketplace', require('./routes/marketplace'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
