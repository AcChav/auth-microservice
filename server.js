const express = require('express');
const helmet = require('helmet');
const { globalLimiter } = require('./middlewares/rateLimiter');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Security Headers
app.use(helmet());

// Global Rate Limiting
app.use(globalLimiter);

// Body Parser
app.use(express.json());

// Mount API routes
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});