// // server/src/controllers/user.controller.js
// const prisma = require('../config/db');
// const bcrypt = require('bcryptjs');

// const getAllUsers = async (req, res) => {
//   try {
//     const users = await prisma.user.findMany({
//       select: { id: true, fullName: true, phone: true, role: true, isActive: true, createdAt: true },
//       orderBy: { createdAt: 'desc' }
//     });
//     res.status(200).json({ status: 'success', data: users });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// const createUser = async (req, res) => {
//   try {
//     const { fullName, phone, pin, role } = req.body;
//     if (!fullName || !phone || !pin) {
//       return res.status(400).json({ status: 'error', message: 'Full name, phone, and PIN are required' });
//     }
//     const existingUser = await prisma.user.findUnique({ where: { phone } });
//     if (existingUser) {
//       return res.status(400).json({ status: 'error', message: 'Phone number already registered' });
//     }
//     const pinHash = await bcrypt.hash(pin, 10);
//     const newUser = await prisma.user.create({
//       data: { fullName, phone, pinHash, role: role || 'CASHIER', isActive: true },
//       select: { id: true, fullName: true, phone: true, role: true, isActive: true, createdAt: true }
//     });
//     res.status(201).json({ status: 'success', message: 'Staff created successfully', data: newUser });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// const toggleUserStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await prisma.user.findUnique({ where: { id } });
//     if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

//     const updated = await prisma.user.update({
//       where: { id },
//       data: { isActive: !user.isActive },
//       select: { id: true, fullName: true, isActive: true }
//     });
//     res.status(200).json({ status: 'success', message: 'Status updated', data: updated });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// const resetUserPin = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { newPin } = req.body;
//     if (!newPin) return res.status(400).json({ status: 'error', message: 'New PIN required' });

//     const pinHash = await bcrypt.hash(newPin, 10);
//     await prisma.user.update({ where: { id }, data: { pinHash } });
//     res.status(200).json({ status: 'success', message: 'PIN reset successfully' });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// module.exports = {
//   getAllUsers,
//   createUser,
//   toggleUserStatus,
//   resetUserPin
// };
// server/src/controllers/user.controller.js
const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        fullName: true, 
        phone: true, 
        role: true, 
        isActive: true, 
        canRefund: true,
        canOverridePrice: true,
        canViewReports: true,
        createdAt: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { fullName, phone, pin, role, canRefund, canOverridePrice, canViewReports } = req.body;
    if (!fullName || !phone || !pin) {
      return res.status(400).json({ status: 'error', message: 'Full name, phone, and PIN are required' });
    }
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Phone number already registered' });
    }
    const pinHash = await bcrypt.hash(pin, 10);
    const newUser = await prisma.user.create({
      data: { 
        fullName, 
        phone, 
        pinHash, 
        role: role || 'CASHIER', 
        canRefund: role === 'ADMIN' ? true : (canRefund || false),
        canOverridePrice: role === 'ADMIN' ? true : (canOverridePrice || false),
        canViewReports: role === 'ADMIN' ? true : (canViewReports || false),
        isActive: true 
      },
      select: { 
        id: true, 
        fullName: true, 
        phone: true, 
        role: true, 
        isActive: true, 
        canRefund: true,
        canOverridePrice: true,
        canViewReports: true,
        createdAt: true 
      }
    });
    res.status(201).json({ status: 'success', message: 'Staff created successfully', data: newUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, fullName: true, isActive: true }
    });
    res.status(200).json({ status: 'success', message: 'Status updated', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const resetUserPin = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPin } = req.body;
    if (!newPin) return res.status(400).json({ status: 'error', message: 'New PIN required' });

    const pinHash = await bcrypt.hash(newPin, 10);
    await prisma.user.update({ where: { id }, data: { pinHash } });
    res.status(200).json({ status: 'success', message: 'PIN reset successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 👈 New controller to update cashier permission toggles
const updatePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { canRefund, canOverridePrice, canViewReports } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: { 
        canRefund: Boolean(canRefund), 
        canOverridePrice: Boolean(canOverridePrice), 
        canViewReports: Boolean(canViewReports) 
      },
      select: { 
        id: true, 
        fullName: true, 
        canRefund: true, 
        canOverridePrice: true, 
        canViewReports: true 
      }
    });

    res.status(200).json({ status: 'success', message: 'Permissions updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  toggleUserStatus,
  resetUserPin,
  updatePermissions
};