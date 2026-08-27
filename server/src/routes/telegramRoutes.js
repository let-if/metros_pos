
// const sendTelegramReceipt = async (chatId, receiptData) => {
//   try {
//     const token = process.env.TELEGRAM_BOT_TOKEN || '8817690392:AAF6EiMSiF3uvG1dkNC6W2wngBqqM32YugE';
//     if (!token || !chatId) {
//       console.error('❌ Missing Telegram token or chatId');
//       return;
//     }

//     const itemsList = (receiptData.items || [])
//       .map((item) => {
//         const productName = item.product?.name || item.name || 'Item';
//         const qty = item.quantity || 1;
//         const price = Number(item.unitPrice || item.price || 0);
//         return `- ${productName} (x${qty}): ${price.toFixed(2)} ETB`;
//       })
//       .join('\n');

//     const message = `
// 🧾 *MERET POS - DIGITAL RECEIPT*
// -----------------------------------
// *Order ID:* #${receiptData.orderId || 'N/A'}
// *Date:* ${new Date().toLocaleString()}

// ${itemsList}

// -----------------------------------
// *Total Amount: ${Number(receiptData.total || receiptData.grandTotal || 0).toFixed(2)} ETB*
// *Payment Method:* ${receiptData.paymentMethod || 'CASH'}

// Thank you for your business! 🎉
//     `.trim();

//     console.log(`📤 Dispatching receipt to Telegram chat ID: ${chatId}...`);

//     const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         chat_id: chatId,
//         text: message,
//         parse_mode: 'Markdown',
//       }),
//     });

//     const data = await response.json();
    
//     if (data.ok) {
//       console.log('🚀 Telegram receipt successfully sent to chat:', chatId);
//     } else {
//       console.error('❌ Telegram API returned an error:', data);
//     }
//   } catch (error) {
//     console.error('❌ Native fetch Telegram send error:', error.message);
//   }
// };
// module.exports = { router, sendTelegramReceipt };
const express = require('express');
const router = express.Router();
const axios = require('axios');

// In-memory storage for recent active users chatting with the bot
let recentChatSessions = [];

// Webhook endpoint where Telegram pushes messages sent by customers
router.post('/webhook', (req, res) => {
  try {
    console.log('🔔 WEBHOOK HIT! Incoming Telegram payload:', JSON.stringify(req.body, null, 2));

    const message = req.body?.message || req.body?.edited_message;
    if (message && message.chat) {
      const chatId = message.chat.id;
      const username = message.chat.first_name || message.chat.username || 'Customer';
      const text = message.text || '';

      console.log(`✅ Processed message from ${username} (${chatId}): "${text}"`);

      // Prevent duplicates and keep last 10 chats
      recentChatSessions = recentChatSessions.filter(s => s.chatId !== chatId);
      recentChatSessions.unshift({
        chatId,
        name: username,
        lastMessage: text,
        time: new Date().toLocaleTimeString()
      });

      if (recentChatSessions.length > 10) recentChatSessions.pop();
    } else {
      console.log('⚠️ Webhook hit, but no valid message structure found.');
    }
  } catch (err) {
    console.error('❌ Error inside webhook handler:', err.message);
  }

  return res.status(200).send('OK');
});

// Endpoint for your frontend to fetch active chat sessions
router.get('/recent-chats', (req, res) => {
  try {
    return res.json({ success: true, chats: recentChatSessions });
  } catch (err) {
    console.error('❌ Error fetching recent chats:', err.message);
    return res.status(500).json({ success: false, chats: [] });
  }
});

// 🔍 DIAGNOSTIC ENHANCED FUNCTION
const sendTelegramReceipt = async (chatId, receiptData) => {
  console.log('🔍 [DIAGNOSTIC] sendTelegramReceipt called with Chat ID:', chatId);
  console.log('🔍 [DIAGNOSTIC] Receipt Data payload received:', JSON.stringify(receiptData, null, 2));

  try {
    const token = process.env.TELEGRAM_BOT_TOKEN || '8817690392:AAF6EiMSiF3uvG1dkNC6W2wngBqqM32YugE';
    if (!token || !chatId) {
      console.error('❌ [DIAGNOSTIC] Missing Telegram token or chatId!', { token: !!token, chatId });
      return;
    }

    const itemsList = (receiptData.items || [])
      .map((item) => {
        const productName = item.product?.name || item.name || 'Item';
        const qty = item.quantity || 1;
        const price = Number(item.unitPrice || item.price || 0);
        return `- ${productName} (x${qty}): ${price.toFixed(2)} ETB`;
      })
      .join('\n');

    const message = `
🧾 *MERET POS - DIGITAL RECEIPT*
-----------------------------------
*Order ID:* #${receiptData.orderId || 'N/A'}
*Date:* ${new Date().toLocaleString()}

${itemsList}

-----------------------------------
*Total Amount: ${Number(receiptData.total || receiptData.grandTotal || 0).toFixed(2)} ETB*
*Payment Method:* ${receiptData.paymentMethod || 'CASH'}

Thank you for your business! 🎉
    `.trim();

    console.log(`📤 [DIAGNOSTIC] Attempting fetch to Telegram API for chat ID: ${chatId}`);

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();
    
    if (data.ok) {
      console.log('🚀 [DIAGNOSTIC] SUCCESS! Telegram receipt sent to chat:', chatId);
    } else {
      console.error('❌ [DIAGNOSTIC] Telegram API REJECTED the request. Response:', data);
    }
  } catch (error) {
    console.error('❌ [DIAGNOSTIC] NETWORK/FETCH EXCEPTION caught:', error.message);
  }
};

module.exports = { router, sendTelegramReceipt };