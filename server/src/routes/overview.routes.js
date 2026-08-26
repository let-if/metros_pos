// // server/src/routes/overview.routes.js
// const express = require('express');
// const router = express.Router();
// const { getDailyOverview } = require('../controllers/overview.controller');
// const { verifyToken } = require('../middleware/auth.middleware');

// router.get('/daily', verifyToken, getDailyOverview);

// module.exports = router;
// server/src/routes/overview.routes.js
const express = require('express');
const router = express.Router();
const { getDailyOverview } = require('../controllers/overview.controller');
const { getAIStoreInsights } = require('../services/geminiService');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/daily', verifyToken, getDailyOverview);

// 🤖 Dedicated asynchronous AI insights endpoint for lightning-fast page loads
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
    console.error('Async AI Insights Error:', error);
    res.status(500).json({ status: 'error', message: 'AI insights temporarily unavailable' });
  }
});

module.exports = router;