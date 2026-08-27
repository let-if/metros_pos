
// const prisma = require('../config/db');
// const { sendSmsNotification } = require('../utils/sms'); // 👈 Import SMS utility service

// // Lookup customer by phone number (for loyalty points & point redemptions)
// const lookupCustomerByPhone = async (req, res) => {
//   try {
//     const { phone } = req.query;

//     if (!phone) {
//       return res.status(400).json({ status: 'error', message: 'Phone query parameter is required' });
//     }

//     const customer = await prisma.customer.findUnique({
//       where: { phone }
//     });

//     if (!customer) {
//       return res.status(404).json({ status: 'error', message: 'Customer not found' });
//     }

//     res.status(200).json({
//       status: 'success',
//       message: 'Customer retrieved successfully',
//       data: customer
//     });
//   } catch (error) {
//     console.error('Customer Lookup Error:', error);
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// // Get all customers list
// const getAllCustomers = async (req, res) => {
//   try {
//     const customers = await prisma.customer.findMany({
//       orderBy: { createdAt: 'desc' }
//     });

//     res.status(200).json({
//       status: 'success',
//       message: 'Customers retrieved successfully',
//       data: customers
//     });
//   } catch (error) {
//     console.error('Get Customers Error:', error);
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// // Get specific customer by ID with full transaction sales history and credit logs
// const getCustomerById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const customer = await prisma.customer.findUnique({
//       where: { id },
//       include: {
//         sales: {
//           include: { items: { include: { product: true } } },
//           orderBy: { createdAt: 'desc' }
//         },
//         creditLogs: {
//           orderBy: { createdAt: 'desc' }
//         }
//       }
//     });

//     if (!customer) {
//       return res.status(404).json({ status: 'error', message: 'Customer not found' });
//     }

//     res.status(200).json({
//       status: 'success',
//       message: 'Customer details retrieved successfully',
//       data: customer
//     });
//   } catch (error) {
//     console.error('Get Customer By ID Error:', error);
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// // 👈 Send custom direct SMS notification to a customer
// const sendCustomerSms = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({ status: 'error', message: 'Message text is required' });
//     }

//     const customer = await prisma.customer.findUnique({ where: { id } });
//     if (!customer) {
//       return res.status(404).json({ status: 'error', message: 'Customer not found' });
//     }

//     const result = await sendSmsNotification(customer.phone, message);
//     if (!result.success) {
//       return res.status(500).json({ status: 'error', message: 'Failed to send SMS through gateway' });
//     }

//     res.status(200).json({ status: 'success', message: 'SMS sent successfully to customer!' });
//   } catch (error) {
//     console.error('Send SMS Error:', error);
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// // 👈 Manually adjust loyalty points (Add or Deduct) from admin panel
// const updateCustomerPoints = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { pointsDelta } = req.body; // Can be positive or negative integer

//     if (pointsDelta === undefined || isNaN(pointsDelta)) {
//       return res.status(400).json({ status: 'error', message: 'Valid pointsDelta is required' });
//     }

//     const customer = await prisma.customer.findUnique({ where: { id } });
//     if (!customer) {
//       return res.status(404).json({ status: 'error', message: 'Customer not found' });
//     }

//     const updatedPoints = Math.max(0, customer.loyaltyPoints + parseInt(pointsDelta));

//     const updatedCustomer = await prisma.customer.update({
//       where: { id },
//       data: { loyaltyPoints: updatedPoints }
//     });

//     res.status(200).json({
//       status: 'success',
//       message: 'Customer loyalty points updated successfully',
//       data: updatedCustomer
//     });
//   } catch (error) {
//     console.error('Update Points Error:', error);
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// module.exports = {
//   lookupCustomerByPhone,
//   getAllCustomers,
//   getCustomerById,
//   sendCustomerSms,
//   updateCustomerPoints
// };
const prisma = require('../config/db');
const { sendSmsNotification } = require('../utils/sms'); // 👈 Import SMS utility service

// Lookup customer by phone number (for loyalty points, redemptions & auto-linking Telegram)
const lookupCustomerByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ status: 'error', message: 'Phone query parameter is required' });
    }

    const customer = await prisma.customer.findUnique({
      where: { phone }
    });

    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    // 💡 customer object automatically includes telegramChatId from Neon DB
    res.status(200).json({
      status: 'success',
      message: 'Customer retrieved successfully',
      data: customer
    });
  } catch (error) {
    console.error('Customer Lookup Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all customers list
const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      status: 'success',
      message: 'Customers retrieved successfully',
      data: customers
    });
  } catch (error) {
    console.error('Get Customers Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get specific customer by ID with full transaction sales history and credit logs
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        sales: {
          include: { items: { include: { product: true } } },
          orderBy: { createdAt: 'desc' }
        },
        creditLogs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Customer details retrieved successfully',
      data: customer
    });
  } catch (error) {
    console.error('Get Customer By ID Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 👈 Send custom direct SMS notification to a customer
const sendCustomerSms = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ status: 'error', message: 'Message text is required' });
    }

    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    const result = await sendSmsNotification(customer.phone, message);
    if (!result.success) {
      return res.status(500).json({ status: 'error', message: 'Failed to send SMS through gateway' });
    }

    res.status(200).json({ status: 'success', message: 'SMS sent successfully to customer!' });
  } catch (error) {
    console.error('Send SMS Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 👈 Manually adjust loyalty points (Add or Deduct) from admin panel
const updateCustomerPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { pointsDelta } = req.body; // Can be positive or negative integer

    if (pointsDelta === undefined || isNaN(pointsDelta)) {
      return res.status(400).json({ status: 'error', message: 'Valid pointsDelta is required' });
    }

    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    const updatedPoints = Math.max(0, customer.loyaltyPoints + parseInt(pointsDelta));

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: { loyaltyPoints: updatedPoints }
    });

    res.status(200).json({
      status: 'success',
      message: 'Customer loyalty points updated successfully',
      data: updatedCustomer
    });
  } catch (error) {
    console.error('Update Points Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  lookupCustomerByPhone,
  getAllCustomers,
  getCustomerById,
  sendCustomerSms,
  updateCustomerPoints
};