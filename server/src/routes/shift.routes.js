// server/src/routes/shift.routes.js
const express = require('express');
const router = express.Router();
const { getActiveShift, openShift, closeShift } = require('../controllers/shift.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/active', verifyToken, getActiveShift);
router.post('/open', verifyToken, openShift);
router.post('/close', verifyToken, closeShift);

module.exports = router;