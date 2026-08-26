// server/src/services/claudeService.js
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const getAIStoreInsights = async (storeData) => {
  try {
    const prompt = `You are an expert retail business advisor for MeretPOS, a retail shop in Addis Ababa, Ethiopia. 
    Analyze today's performance metrics and provide exactly 3 short, actionable, bulleted insights or recommendations for the store owner:
    - Total Revenue: ${storeData.todayRevenue} ETB
    - Total Transactions: ${storeData.todaySalesCount}
    - Low Stock Items Count: ${storeData.lowStockCount}
    - Outstanding Yeketena Credit Debt: ${storeData.totalOutstandingCredit} ETB
    - Cashier Breakdown: ${JSON.stringify(storeData.cashierBreakdown || [])}

    Keep the tone professional, encouraging, and focused on retail optimization (inventory control, debt collection, and sales growth).`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }]
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Claude AI Advisor Error:', error);
    return 'AI insights are temporarily unavailable. Check your API quota or network connection.';
  }
};

module.exports = { getAIStoreInsights };