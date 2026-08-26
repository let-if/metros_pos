// server/src/routes/sale.routes.js
const express = require('express');
const router = express.Router();
const { createSale, getSalesHistory, refundSale } = require('../controllers/sale.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, createSale);
router.get('/', verifyToken, getSalesHistory);
router.delete('/:saleId/refund', verifyToken, refundSale); // 👈 Added refund route

module.exports = router;