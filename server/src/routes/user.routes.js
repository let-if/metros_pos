// // server/src/routes/user.routes.js
// const express = require('express');
// const router = express.Router();
// const { getAllUsers, createUser, toggleUserStatus, resetUserPin } = require('../controllers/user.controller');
// const { verifyToken, requireAdmin } = require('../middleware/auth.middleware'); // 👈 Correct path

// router.get('/', verifyToken, requireAdmin, getAllUsers);
// router.post('/', verifyToken, requireAdmin, createUser);
// router.patch('/:id/status', verifyToken, requireAdmin, toggleUserStatus);
// router.patch('/:id/reset-pin', verifyToken, requireAdmin, resetUserPin);

// module.exports = router;
// server/src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  createUser, 
  toggleUserStatus, 
  resetUserPin, 
  updatePermissions 
} = require('../controllers/user.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', verifyToken, requireAdmin, getAllUsers);
router.post('/', verifyToken, requireAdmin, createUser);
router.patch('/:id/status', verifyToken, requireAdmin, toggleUserStatus);
router.patch('/:id/reset-pin', verifyToken, requireAdmin, resetUserPin);
router.patch('/:id/permissions', verifyToken, requireAdmin, updatePermissions); // 👈 Added permissions route

module.exports = router;