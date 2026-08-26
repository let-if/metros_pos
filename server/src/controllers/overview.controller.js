
// const prisma = require('../config/db');

// const getDailyOverview = async (req, res) => {
//   try {
//     const { userId, role } = req.user;
    
//     // Calculate start of today reliably avoiding local-to-UTC truncation bugs
//     const now = new Date();
    
//     // Build a precise ISO date string for the beginning of today in local calendar terms
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const day = String(now.getDate()).padStart(2, '0');
//     const localStartString = `${year}-${month}-${day}T00:00:00.000Z`;
//     const startOfDay = new Date(localStartString);

//     // 1. Fetch today's sales using a safe floor boundary
//     const todaySales = await prisma.sale.findMany({
//       where: {
//         createdAt: { gte: startOfDay },
//         ...(role === 'CASHIER' ? { cashierId: userId } : {}) // Cashiers see only their sales; Admins see all
//       },
//       include: { 
//         items: true,
//         cashier: { select: { fullName: true } }
//       }
//     });

//     let todayRevenue = 0;
//     todaySales.forEach(sale => {
//       todayRevenue += Number(sale.grandTotal || sale.totalAmount || 0);
//     });

//     let lowStockCount = 0;
//     let totalOutstandingCredit = 0;
//     let cashierBreakdown = [];

//     // 2. Admin-specific extra metrics
//     if (role === 'ADMIN') {
//       const products = await prisma.product.findMany();
//       lowStockCount = products.filter(p => p.stockQty <= (p.lowStockAlert || 5)).length;

//       const customers = await prisma.customer.findMany();
//       customers.forEach(c => {
//         totalOutstandingCredit += Number(c.totalCredit || 0);
//       });

//       // Group store-wide sales by cashier for today's live audit
//       const cashierMap = {};
//       todaySales.forEach(sale => {
//         const name = sale.cashier?.fullName || 'Staff Member';
//         if (!cashierMap[name]) {
//           cashierMap[name] = { cashierName: name, salesCount: 0, totalRevenue: 0 };
//         }
//         cashierMap[name].salesCount += 1;
//         cashierMap[name].totalRevenue += Number(sale.grandTotal || sale.totalAmount || 0);
//       });
//       cashierBreakdown = Object.values(cashierMap);
//     }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         role,
//         todaySalesCount: todaySales.length,
//         todayRevenue,
//         lowStockCount: role === 'ADMIN' ? lowStockCount : null,
//         totalOutstandingCredit: role === 'ADMIN' ? totalOutstandingCredit : null,
//         cashierBreakdown: role === 'ADMIN' ? cashierBreakdown : null,
//         date: `${year}-${month}-${day}`
//       }
//     });

//   } catch (error) {
//     console.error('Daily Overview Error:', error);
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// module.exports = { getDailyOverview };
// server/src/controllers/overview.controller.js
const prisma = require('../config/db');
const { getAIStoreInsights } = require('../services/geminiService');

const getDailyOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const requestedLang = req.query.lang || 'en';

    // Start of today (00:00:00 local time)
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const salesQuery = {
      where: { createdAt: { gte: startOfDay } },
      include: {
        items: { include: { product: true } },
        cashier: { select: { fullName: true } }
      }
    };

    if (role !== 'ADMIN') {
      salesQuery.where.cashierId = userId;
    }

    const todaySales = await prisma.sale.findMany(salesQuery);

    let todayRevenue = 0;
    const cashierMap = {};

    todaySales.forEach(sale => {
      const amount = Number(sale.grandTotal || sale.totalAmount || 0);
      todayRevenue += amount;

      const cashierName = sale.cashier?.fullName || 'Staff Member';
      if (!cashierMap[cashierName]) {
        cashierMap[cashierName] = { cashierName, salesCount: 0, totalRevenue: 0 };
      }
      cashierMap[cashierName].salesCount += 1;
      cashierMap[cashierName].totalRevenue += amount;
    });

    const cashierBreakdown = Object.values(cashierMap);

    let lowStockCount = 0;
    let totalOutstandingCredit = 0;

    if (role === 'ADMIN') {
      // 🛠️ FIX: Use correct prisma schema fields (stockQty and lowStockAlert)
      const allProducts = await prisma.product.findMany();
      lowStockCount = allProducts.filter(p => p.stockQty <= (p.lowStockAlert || 5)).length;

      const customers = await prisma.customer.findMany();
      totalOutstandingCredit = customers.reduce((acc, c) => acc + Number(c.creditBalance || c.balance || 0), 0);
    }

    let aiInsights = null;
    if (role === 'ADMIN') {
      try {
        aiInsights = await getAIStoreInsights({
          todayRevenue,
          todaySalesCount: todaySales.length,
          lowStockCount,
          totalOutstandingCredit,
          cashierBreakdown
        }, requestedLang);
      } catch (aiErr) {
        console.error('AI Insights error:', aiErr);
        aiInsights = requestedLang === 'am' 
          ? '• የዕለት ተዕለት የሽያጭ መረጃዎችን መከታተል ይቀጥሉ።' 
          : '• Monitor daily sales metrics regularly.';
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        role,
        date: now.toISOString().split('T')[0],
        todayRevenue,
        todaySalesCount: todaySales.length,
        lowStockCount,
        totalOutstandingCredit,
        cashierBreakdown,
        aiInsights
      }
    });

  } catch (error) {
    console.error('Daily Overview Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getDailyOverview };