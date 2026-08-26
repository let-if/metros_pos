
// const express = require('express');
// const router = express.Router();
// const { getFinancialReports } = require('../controllers/reports.controller');
// const { verifyToken } = require('../middleware/auth.middleware');

// // 👈 Removed requireAdmin so cashiers with canViewReports can access this endpoint
// router.get('/', verifyToken, getFinancialReports);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { getFinancialReports } = require('../controllers/reports.controller');
const { getAIStoreInsights } = require('../services/geminiService');
const { verifyToken } = require('../middleware/auth.middleware');

// 👈 Cashiers with canViewReports or admins can access financial reports instantly
router.get('/', verifyToken, getFinancialReports);

// 🤖 Dedicated asynchronous AI insights endpoint for lightning-fast financial report page loads
router.post('/ai-insights', verifyToken, async (req, res) => {
  try {
    const { todayRevenue, todaySalesCount, grossProfit, profitMargin, bestSellers, timeRange, language } = req.body;
    
    const insights = await getAIStoreInsights({
      todayRevenue,
      todaySalesCount,
      grossProfit,
      profitMargin,
      bestSellers,
      timeRange,
      language
    });

    res.status(200).json({ status: 'success', data: { insights } });
  } catch (error) {
    console.error('Reports Async AI Insights Error:', error);
    res.status(500).json({ status: 'error', message: 'AI insights temporarily unavailable' });
  }
});

module.exports = router;