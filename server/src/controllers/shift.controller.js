// server/src/controllers/shift.controller.js
const prisma = require('../config/db');

// Get active shift for current user
const getActiveShift = async (req, res) => {
  try {
    const shift = await prisma.shift.findFirst({
      where: { userId: req.user.userId, status: 'OPEN' },
      include: { sales: true }
    });
    res.status(200).json({ status: 'success', data: shift });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Open a new shift with starting float
const openShift = async (req, res) => {
  try {
    const { openingFloat } = req.body;
    
    // Check if user already has an open shift
    const existing = await prisma.shift.findFirst({
      where: { userId: req.user.userId, status: 'OPEN' }
    });

    if (existing) {
      return res.status(400).json({ status: 'error', message: 'You already have an active open shift' });
    }

    const shift = await prisma.shift.create({
      data: {
        userId: req.user.userId,
        openingFloat: Number(openingFloat || 0),
        status: 'OPEN'
      }
    });

    res.status(201).json({ status: 'success', message: 'Shift opened successfully', data: shift });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// Close shift and generate Z-Report reconciliation
const closeShift = async (req, res) => {
  try {
    const { shiftId, closingCash } = req.body;

    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      include: { sales: true }
    });

    if (!shift || shift.status !== 'OPEN') {
      return res.status(404).json({ status: 'error', message: 'Active shift not found' });
    }

    // Tally totals by payment method during this shift
    let cashSales = 0;
    let telebirrSales = 0;
    let creditSales = 0;

    shift.sales.forEach(sale => {
      const amount = Number(sale.grandTotal || sale.totalAmount || 0);
      if (sale.paymentMethod === 'CASH') cashSales += amount;
      else if (sale.paymentMethod === 'TELEBIRR') telebirrSales += amount;
      else if (sale.paymentMethod === 'CREDIT') creditSales += amount;
    });

    const totalSales = cashSales + telebirrSales + creditSales;
    
    // 👇 FIXED: Expected cash is your opening float + ONLY cash sales (Telebirr & Credit don't go into physical cash drawer)
    const expectedCash = Number(shift.openingFloat) + cashSales;
    
    const actualCash = Number(closingCash);
    const discrepancy = actualCash - expectedCash; // Positive = surplus, Negative = shortage

    const closedShift = await prisma.shift.update({
      where: { id: shiftId },
      data: {
        closingCash: actualCash,
        expectedCash,
        totalTelebirr: telebirrSales,
        totalCredit: creditSales,
        totalSales,
        discrepancy,
        status: 'CLOSED',
        closedAt: new Date()
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Z-Report generated and shift closed successfully',
      data: closedShift
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getActiveShift, openShift, closeShift };