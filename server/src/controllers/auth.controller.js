// // server/src/controllers/auth.controller.js
// const prisma = require('../config/db');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Login controller supporting Admin or Cashier access
// const login = async (req, res) => {
//   try {
//     const { phone, pin } = req.body;

//     if (!phone || !pin) {
//       return res.status(400).json({ status: 'error', message: 'Phone number and PIN/password are required' });
//     }

//     // Find user by phone number
//     const user = await prisma.user.findUnique({ where: { phone } });
//     if (!user || !user.isActive) {
//       return res.status(401).json({ status: 'error', message: 'Invalid credentials or account disabled' });
//     }

//     // Compare provided PIN/password hash
//     const isMatch = await bcrypt.compare(pin, user.pinHash);
//     if (!isMatch) {
//       return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
//     }

//     // Generate JWT token valid for 7 days
//     const token = jwt.sign(
//       { userId: user.id, role: user.role, phone: user.phone },
//       process.env.JWT_SECRET || 'fallback_secret',
//       { expiresIn: '7d' }
//     );

//     res.status(200).json({
//       status: 'success',
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         fullName: user.fullName,
//         phone: user.phone,
//         role: user.role,
//       }
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ status: 'error', message: 'Server error during login' });
//   }
// };

// // Seed initial admin or cashier user for testing
// const seedUser = async (req, res) => {
//   try {
//     const { fullName, phone, pin, role } = req.body;
//     const existing = await prisma.user.findUnique({ where: { phone } });
//     if (existing) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const pinHash = await bcrypt.hash(pin, 10);
//     const newUser = await prisma.user.create({
//       data: { fullName, phone, pinHash, role: role || 'ADMIN' }
//     });

//     res.status(201).json({ status: 'success', message: 'User created successfully', user: newUser });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// module.exports = { login, seedUser };
// server/src/controllers/auth.controller.js
const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login controller supporting Admin or Cashier access
const login = async (req, res) => {
  try {
    const { phone, pin } = req.body;

    if (!phone || !pin) {
      return res.status(400).json({ status: 'error', message: 'Phone number and PIN/password are required' });
    }

    // Find user by phone number
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || !user.isActive) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials or account disabled' });
    }

    // Compare provided PIN/password hash
    const isMatch = await bcrypt.compare(pin, user.pinHash);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // 👈 CRITICAL FIX: Include granular permissions in JWT payload
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role, 
        phone: user.phone,
        canRefund: user.canRefund,
        canOverridePrice: user.canOverridePrice,
        canViewReports: user.canViewReports
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        canRefund: user.canRefund,
        canOverridePrice: user.canOverridePrice,
        canViewReports: user.canViewReports
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status: 'error', message: 'Server error during login' });
  }
};

// Seed initial admin or cashier user for testing
const seedUser = async (req, res) => {
  try {
    const { fullName, phone, pin, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const pinHash = await bcrypt.hash(pin, 10);
    const newUser = await prisma.user.create({
      data: { 
        fullName, 
        phone, 
        pinHash, 
        role: role || 'ADMIN',
        canRefund: true,
        canOverridePrice: true,
        canViewReports: true
      }
    });

    res.status(201).json({ status: 'success', message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { login, seedUser };