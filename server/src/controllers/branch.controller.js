// server/src/controllers/branch.controller.js
const prisma = require('../config/db');

const getBranches = async (req, res) => {
  try {
    let branches = await prisma.branch.findMany({
      orderBy: { createdAt: 'asc' }
    });

    // Ensure Central Warehouse always exists as an option
    const hasWarehouse = branches.some(b => b.isWarehouse);
    if (!hasWarehouse) {
      const central = await prisma.branch.create({
        data: {
          name: 'Central Warehouse',
          location: 'Addis Ababa Logistics Center',
          isWarehouse: true
        }
      });
      branches.unshift(central); // Add it to the top of the list
    }

    res.status(200).json({ status: 'success', data: branches });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// 👈 Add method to create new custom branches
const createBranch = async (req, res) => {
  try {
    const { name, location, isWarehouse } = req.body;
    if (!name) {
      return res.status(400).json({ status: 'error', message: 'Branch name is required.' });
    }

    const newBranch = await prisma.branch.create({
      data: {
        name,
        location: location || 'Addis Ababa, Ethiopia',
        isWarehouse: Boolean(isWarehouse)
      }
    });

    res.status(201).json({ status: 'success', message: 'Branch created successfully', data: newBranch });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Branch name already exists or invalid data.' });
  }
};

module.exports = { getBranches, createBranch };