// server/src/controllers/credit.controller.js
const prisma = require('../config/db');

// Get all customers with credit records and ledger history
const getCreditCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        creditLogs: {
          include: { sale: true, recordedBy: { select: { fullName: true } } },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { totalCredit: 'desc' }
    });

    res.status(200).json({ status: 'success', data: customers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Settle or record a credit payment (repayment)
const settleCredit = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { amountPaid, notes } = req.body;

    const paymentAmount = Number(amountPaid);
    if (!paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Please provide a valid repayment amount' });
    }

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    const currentDebt = Number(customer.totalCredit);
    if (paymentAmount > currentDebt) {
      return res.status(400).json({ status: 'error', message: `Repayment cannot exceed outstanding balance of ${currentDebt.toFixed(2)} ETB` });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Reduce customer's total credit
      const updatedCustomer = await tx.customer.update({
        where: { id: customerId },
        data: { totalCredit: { decrement: paymentAmount } }
      });

      // 2. Record repayment in CreditLedger as a negative or settlement log
      await tx.creditLedger.create({
        data: {
          customerId,
          recordedById: req.user.userId,
          amountOwed: -paymentAmount, // Negative to show repayment
          notes: notes ? `Repayment: ${notes}` : 'Credit debt repayment settlement',
          isSettled: true
        }
      });

      return updatedCustomer;
    });

    res.status(200).json({
      status: 'success',
      message: 'Credit repayment recorded successfully',
      data: result
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getCreditCustomers, settleCredit };