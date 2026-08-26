
// const prisma = require('../config/db');
// const { getAIStoreInsights } = require('../services/geminiService'); // 👈 Import Gemini service

// const getFinancialReports = async (req, res) => {
//   try {
//     // 🛑 CRITICAL SECURITY GUARD: Allow ADMIN or users with explicit canViewReports permission
//     if (req.user.role !== 'ADMIN' && !req.user.canViewReports) {
//       return res.status(403).json({ 
//         status: 'error', 
//         message: 'Unauthorized: You do not have permission to view financial reports.' 
//       });
//     }

//     const { range } = req.query; // 'today', 'week', 'month', 'all'
    
//     let dateFilter = {};
//     const now = new Date();

//     if (range === 'today') {
//       // Start of today (00:00:00 local time)
//       const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       dateFilter = { gte: startOfDay };
//     } else if (range === 'week') {
//       // Fresh date instance to prevent mutation bugs
//       const startOfWeek = new Date();
//       startOfWeek.setDate(startOfWeek.getDate() - 7);
//       startOfWeek.setHours(0, 0, 0, 0);
//       dateFilter = { gte: startOfWeek };
//     } else if (range === 'month') {
//       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       dateFilter = { gte: startOfMonth };
//     }

//     const salesQuery = {
//       include: {
//         items: {
//           include: { product: true }
//         },
//         customer: true,
//         cashier: { select: { fullName: true } }
//       },
//       orderBy: { createdAt: 'desc' }
//     };

//     if (Object.keys(dateFilter).length > 0) {
//       salesQuery.where = { createdAt: dateFilter };
//     }

//     const sales = await prisma.sale.findMany(salesQuery);

//     let totalRevenue = 0;
//     let totalCost = 0;
//     let totalTransactions = sales.length;
//     const paymentBreakdown = { CASH: 0, TELEBIRR: 0, BANK_TRANSFER: 0, CREDIT: 0 };
//     const productSalesMap = {};

//     sales.forEach(sale => {
//       const saleAmount = Number(sale.grandTotal || sale.totalAmount || 0);
//       totalRevenue += saleAmount;

//       const method = (sale.paymentMethod || 'CASH').toUpperCase();
//       if (paymentBreakdown[method] !== undefined) {
//         paymentBreakdown[method] += saleAmount;
//       } else {
//         paymentBreakdown.CASH += saleAmount;
//       }

//       sale.items.forEach(item => {
//         const itemQty = item.quantity;
//         const itemCostPrice = Number(item.product?.costPrice || 0);
//         totalCost += (itemCostPrice * itemQty);

//         // Track best sellers
//         const prodName = item.product?.name || 'Unknown Product';
//         if (!productSalesMap[prodName]) {
//           productSalesMap[prodName] = { quantity: 0, revenue: 0 };
//         }
//         productSalesMap[prodName].quantity += itemQty;
//         productSalesMap[prodName].revenue += Number(item.totalPrice || item.subtotal || 0);
//       });
//     });

//     const grossProfit = totalRevenue - totalCost;
//     const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

//     // Convert map to sorted array for leaderboard
//     const bestSellers = Object.entries(productSalesMap)
//       .map(([name, data]) => ({ name, ...data }))
//       .sort((a, b) => b.quantity - a.quantity)
//       .slice(0, 5);

//     // 🤖 Fetch dynamic Gemini AI Financial & Profitability Insights
//     let aiReportInsights = null;
//     try {
//       aiReportInsights = await getAIStoreInsights({
//         todayRevenue: totalRevenue,
//         todaySalesCount: totalTransactions,
//         lowStockCount: 0, // optional placeholder for financial report scope
//         totalOutstandingCredit: paymentBreakdown.CREDIT,
//         grossProfit,
//         profitMargin: profitMargin.toFixed(1),
//         bestSellers: bestSellers.map(b => b.name),
//         timeRange: range || 'today'
//       });
//     } catch (aiErr) {
//       console.error('Report AI generation warning:', aiErr);
//     }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         metrics: {
//           totalRevenue,
//           totalCost,
//           grossProfit,
//           profitMargin: profitMargin.toFixed(1),
//           totalTransactions
//         },
//         paymentBreakdown,
//         bestSellers,
//         recentSales: sales.slice(0, 50),
//         aiReportInsights // 👈 Included in the financial reports response for your UI or PDF export
//       }
//     });

//   } catch (error) {
//     console.error('Financial Reports Error:', error);
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// module.exports = { getFinancialReports };
// server/src/controllers/reports.controller.js
const prisma = require('../config/db');
const { getAIStoreInsights } = require('../services/geminiService');

const getFinancialReports = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN' && !req.user.canViewReports) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Unauthorized: You do not have permission to view financial reports.' 
      });
    }

    const { range, branchId } = req.query;
    
    let dateFilter = {};
    const now = new Date();

    if (range === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter = { gte: startOfDay };
    } else if (range === 'week') {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 7);
      startOfWeek.setHours(0, 0, 0, 0);
      dateFilter = { gte: startOfWeek };
    } else if (range === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { gte: startOfMonth };
    }

    const salesQuery = {
      include: {
        items: { include: { product: true } },
        customer: true,
        cashier: { select: { fullName: true } },
        branch: true
      },
      orderBy: { createdAt: 'desc' }
    };

    const whereConditions = {};
    if (Object.keys(dateFilter).length > 0) whereConditions.createdAt = dateFilter;
    if (branchId) whereConditions.branchId = branchId;
    if (Object.keys(whereConditions).length > 0) salesQuery.where = whereConditions;

    const sales = await prisma.sale.findMany(salesQuery);

    let totalRevenue = 0;
    let totalCost = 0;
    let totalTransactions = sales.length;
    const paymentBreakdown = { CASH: 0, TELEBIRR: 0, BANK_TRANSFER: 0, CREDIT: 0 };
    const productSalesMap = {};
    const branchPerformanceMap = {};

    sales.forEach(sale => {
      const saleAmount = Number(sale.grandTotal || sale.totalAmount || 0);
      totalRevenue += saleAmount;

      const method = (sale.paymentMethod || 'CASH').toUpperCase();
      if (paymentBreakdown[method] !== undefined) {
        paymentBreakdown[method] += saleAmount;
      } else {
        paymentBreakdown.CASH += saleAmount;
      }

      const bId = sale.branchId || 'unassigned';
      const bName = sale.branch?.name || 'General Store';
      if (!branchPerformanceMap[bId]) {
        branchPerformanceMap[bId] = {
          branchId: bId,
          branchName: bName,
          isWarehouse: sale.branch?.isWarehouse || false,
          location: sale.branch?.location || 'Addis Ababa',
          totalRevenue: 0,
          totalTransactions: 0
        };
      }
      branchPerformanceMap[bId].totalRevenue += saleAmount;
      branchPerformanceMap[bId].totalTransactions += 1;

      sale.items.forEach(item => {
        const itemQty = item.quantity;
        const itemCostPrice = Number(item.product?.costPrice || 0);
        totalCost += (itemCostPrice * itemQty);

        const prodName = item.product?.name || 'Unknown Product';
        if (!productSalesMap[prodName]) {
          productSalesMap[prodName] = { quantity: 0, revenue: 0 };
        }
        productSalesMap[prodName].quantity += itemQty;
        productSalesMap[prodName].revenue += Number(item.totalPrice || item.subtotal || 0);
      });
    });

    const allBranches = await prisma.branch.findMany({
      include: {
        inventories: { include: { product: true } }
      }
    });

    // 👈 Fetch master product catalog to directly capture system product stock for warehouses
    const allProducts = await prisma.product.findMany();
    const totalMasterStockQty = allProducts.reduce((acc, p) => acc + (p.stockQty || 0), 0);
    const totalMasterStockValuation = allProducts.reduce((acc, p) => acc + ((p.stockQty || 0) * (p.costPrice || 0)), 0);

    const branchPerformance = allBranches.map(branch => {
      const existing = branchPerformanceMap[branch.id] || {
        totalRevenue: 0,
        totalTransactions: 0
      };

      let stockValuation = 0;
      let totalItemsInStock = 0;

      // 👈 Force Central Warehouse (or any branch marked as warehouse) to capture system product stock directly
      if (branch.isWarehouse) {
        stockValuation = totalMasterStockValuation;
        totalItemsInStock = totalMasterStockQty;
      } else {
        stockValuation = branch.inventories.reduce((acc, inv) => {
          return acc + (inv.stockQty * (inv.product?.costPrice || 0));
        }, 0);
        totalItemsInStock = branch.inventories.reduce((acc, inv) => acc + inv.stockQty, 0);
      }

      return {
        branchId: branch.id,
        branchName: branch.name,
        isWarehouse: branch.isWarehouse,
        location: branch.location,
        totalRevenue: existing.totalRevenue,
        totalTransactions: existing.totalTransactions,
        stockValuation,
        totalItemsInStock
      };
    });

    const grossProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const bestSellers = Object.entries(productSalesMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    let aiReportInsights = null;
    try {
      aiReportInsights = await getAIStoreInsights({
        todayRevenue: totalRevenue,
        todaySalesCount: totalTransactions,
        lowStockCount: 0,
        totalOutstandingCredit: paymentBreakdown.CREDIT,
        grossProfit,
        profitMargin: profitMargin.toFixed(1),
        bestSellers: bestSellers.map(b => b.name),
        timeRange: range || 'today'
      });
    } catch (aiErr) {
      console.error('Report AI generation warning:', aiErr);
    }

    res.status(200).json({
      status: 'success',
      data: {
        metrics: {
          totalRevenue,
          totalCost,
          grossProfit,
          profitMargin: profitMargin.toFixed(1),
          totalTransactions
        },
        paymentBreakdown,
        bestSellers,
        branchPerformance,
        recentSales: sales.slice(0, 50),
        aiReportInsights
      }
    });

  } catch (error) {
    console.error('Financial Reports Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getFinancialReports };