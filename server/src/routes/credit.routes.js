// server/src/routes/credit.routes.js
const express = require('express');
const router = express.Router();
const { getCreditCustomers, settleCredit } = require('../controllers/credit.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, getCreditCustomers);
router.post('/:customerId/settle', verifyToken, settleCredit);

module.exports = router;