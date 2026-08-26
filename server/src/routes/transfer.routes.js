// server/src/routes/transfer.routes.js
const express = require('express');
const router = express.Router();
const { getTransfers, executeStockTransfer } = require('../controllers/transfer.controller');
// 👈 Point to the correct filename and use your existing middleware functions
const { verifyToken: protect, requireAdmin: adminOnly } = require('../middleware/auth.middleware');

router.get('/', protect, adminOnly, getTransfers);
router.post('/', protect, adminOnly, executeStockTransfer);

module.exports = router;