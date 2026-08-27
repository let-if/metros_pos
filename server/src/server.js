const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const saleRoutes = require('./routes/sale.routes');
const creditRoutes = require('./routes/credit.routes');
const reportsRoutes = require('./routes/reports.routes');
const overviewRoutes = require('./routes/overview.routes');
// Add this inside server/src/server.js
const shiftRoutes = require('./routes/shift.routes');
const userRoutes = require('./routes/user.routes');
const customerRoutes = require('./routes/customer.routes');
// Import the transfer routes
const transferRoutes = require('./routes/transfer.routes');
const branchRoutes = require('./routes/branch.routes');
const { router: telegramRouter } = require('./routes/telegramRoutes');

// Mount it under /api/telegram

// Mount the route under /api/transfers

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/overview', overviewRoutes);
app.use('/api/shift', shiftRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/branches', branchRoutes);
// Change this line:
// app.use('/telegram', telegramRouter);

// To this:
app.use('/api/telegram', telegramRouter);
// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'MeretPOS Backend is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err.stack);
  res.status(500).json({ 
    status: 'error', 
    message: err.message || 'Internal Server Error' 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 MeretPOS server is running live on port ${PORT}`);
});