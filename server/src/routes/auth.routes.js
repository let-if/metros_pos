const express = require('express');
const router = express.Router();
const { login, seedUser } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/seed', seedUser);

module.exports = router;