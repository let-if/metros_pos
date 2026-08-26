// server/src/utils/sms.js
const axios = require('axios');

const sendSmsNotification = async (phone, messageText) => {
  try {
    // Standard format for Ethiopian gateways (e.g., SMSEthiopia API)
    const response = await axios.post(
      'https://smsethiopia.com/api/sms/send',
      {
        msisdn: phone, // Example format: 2519xxxxxxxx
        text: messageText
      },
      {
        headers: {
          'KEY': process.env.SMS_API_KEY, 
          'Content-Type': 'application/json'
        }
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('SMS Gateway Error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSmsNotification };