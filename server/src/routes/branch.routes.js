// server/src/routes/branch.routes.js
const express = require('express');
const router = express.Router();
const { getBranches, createBranch } = require('../controllers/branch.controller');
const { verifyToken: protect, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', protect, getBranches);
router.post('/', protect, requireAdmin, createBranch); // 👈 Admin-only branch creation

module.exports = router;