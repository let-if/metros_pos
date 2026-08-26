// // server/src/routes/customer.routes.js
// const express = require('express');
// const router = express.Router();
// const { lookupCustomerByPhone, getAllCustomers, getCustomerById } = require('../controllers/customer.controller');
// const { verifyToken } = require('../middleware/auth.middleware');

// router.get('/lookup', verifyToken, lookupCustomerByPhone);
// router.get('/:id', verifyToken, getCustomerById); // 👈 Added for profile details
// router.get('/', verifyToken, getAllCustomers);

// module.exports = router;
// server/src/routes/customer.routes.js
const express = require('express');
const router = express.Router();
const { 
  lookupCustomerByPhone, 
  getAllCustomers, 
  getCustomerById, 
  sendCustomerSms, 
  updateCustomerPoints 
} = require('../controllers/customer.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/lookup', verifyToken, lookupCustomerByPhone);
router.get('/:id', verifyToken, getCustomerById); // 👈 Added for profile details
router.get('/', verifyToken, getAllCustomers);

// 👈 New Routes for SMS alerts and manual point adjustments
router.post('/:id/sms', verifyToken, sendCustomerSms);
router.patch('/:id/points', verifyToken, updateCustomerPoints);

module.exports = router;