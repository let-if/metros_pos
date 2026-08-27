
// const prisma = require('../config/db');

// // Process a POS sale transaction with Branch-Specific Inventory Tracking & Price Overrides
// const createSale = async (req, res) => {
//   try {
//     const { items, paymentMethod, customerName, customerPhone, terminalId, redeemPoints, branchId } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ status: 'error', message: 'Cart is empty' });
//     }

//     const currentTerminal = terminalId || 'POS-1';

//     // 0. Determine the active branch for this sale:
//     let targetBranchId = branchId;
//     if (!targetBranchId) {
//       const cashierUser = await prisma.user.findUnique({
//         where: { id: req.user.userId },
//         select: { branchId: true }
//       });
//       targetBranchId = cashierUser?.branchId;
//     }

//     if (!targetBranchId) {
//       let centralWarehouse = await prisma.branch.findFirst({ where: { isWarehouse: true } });
//       if (!centralWarehouse) {
//         centralWarehouse = await prisma.branch.findFirst();
//       }
//       if (!centralWarehouse) {
//         return res.status(400).json({ status: 'error', message: 'No active branch or warehouse configured in the system.' });
//       }
//       targetBranchId = centralWarehouse.id;
//     }

//     // Verify branch exists
//     const branch = await prisma.branch.findUnique({ where: { id: targetBranchId } });
//     if (!branch) {
//       return res.status(404).json({ status: 'error', message: 'Assigned branch location not found.' });
//     }

//     // 0. Find the active open shift for this cashier on this specific terminal
//     const activeShift = await prisma.shift.findFirst({
//       where: { userId: req.user.userId, status: 'OPEN', terminalId: currentTerminal }
//     });

//     let subTotalAmount = 0;
//     const orderItemsData = [];
//     const stockVerificationMap = [];

//     // 1. Verify stock availability and handle custom unit price overrides
//     for (const item of items) {
//       const product = await prisma.product.findUnique({ where: { id: item.productId } });
//       if (!product) {
//         return res.status(404).json({ status: 'error', message: `Product not found` });
//       }

//       let availableQty = 0;
//       let branchInventoryRecord = null;

//       if (branch.isWarehouse) {
//         availableQty = product.stockQty;
//       } else {
//         branchInventoryRecord = await prisma.inventory.findUnique({
//           where: { productId_branchId: { productId: product.id, branchId: targetBranchId } }
//         });
//         availableQty = branchInventoryRecord ? branchInventoryRecord.stockQty : 0;
//       }

//       if (availableQty < item.quantity) {
//         return res.status(400).json({ 
//           status: 'error', 
//           message: `Insufficient stock for ${product.name} at ${branch.name}. Available: ${availableQty}, Requested: ${item.quantity}` 
//         });
//       }

//       // 👈 Respect overridden unitPrice from cart item payload if present, otherwise fallback to product.unitPrice
//       const effectiveUnitPrice = item.unitPrice !== undefined ? Number(item.unitPrice) : Number(product.unitPrice);
//       const lineTotal = effectiveUnitPrice * item.quantity;
//       subTotalAmount += lineTotal;

//       orderItemsData.push({
//         productId: product.id,
//         quantity: item.quantity,
//         unitPrice: effectiveUnitPrice, // 👈 Saves overridden price to the database
//         totalPrice: lineTotal
//       });

//       stockVerificationMap.push({
//         productId: product.id,
//         quantity: item.quantity,
//         isWarehouse: branch.isWarehouse,
//         inventoryId: branchInventoryRecord?.id
//       });
//     }

//     // Apply point redemption discount if requested
//     let finalGrandTotal = subTotalAmount;
//     let pointsToDeduct = 0;
    
//     let customerRecordId = null;
//     let customerRecord = null;

//     if (customerPhone && customerName) {
//       customerRecord = await prisma.customer.upsert({
//         where: { phone: customerPhone },
//         update: { fullName: customerName },
//         create: { fullName: customerName, phone: customerPhone }
//       });
//       customerRecordId = customerRecord.id;

//       if (redeemPoints && customerRecord.loyaltyPoints >= 100) {
//         finalGrandTotal = Math.max(0, subTotalAmount - 100);
//         pointsToDeduct = 100;
//       }
//     }

//     // Generate receipt and ERCA Fiscal Counter
//     const receiptNo = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//     const randomDigits = Math.floor(100000 + Math.random() * 900000);
//     const fiscalReceiptNumber = `FRC-${new Date().getFullYear()}-${randomDigits}`;

//     const earnedPoints = Math.floor(finalGrandTotal / 10);

//     // 2. Execute database transaction
//     const result = await prisma.$transaction(async (tx) => {
//       const sale = await tx.sale.create({
//         data: {
//           receiptNo,
//           fiscalReceiptNumber,
//           subTotal: subTotalAmount,
//           grandTotal: finalGrandTotal,
//           paymentMethod: paymentMethod || 'CASH',
//           cashierId: req.user.userId,
//           customerId: customerRecordId,
//           terminalId: currentTerminal,
//           shiftId: activeShift ? activeShift.id : null,
//           branchId: targetBranchId, 
//           items: { create: orderItemsData }
//         },
//         include: { items: { include: { product: true } }, cashier: { select: { fullName: true } }, customer: true, branch: true }
//       });

//       // Decrement stock quantities from the specific branch inventory (or master product if warehouse)
//       for (const stockItem of stockVerificationMap) {
//         if (stockItem.isWarehouse) {
//           await tx.product.update({
//             where: { id: stockItem.productId },
//             data: { stockQty: { decrement: stockItem.quantity } }
//           });
//         } else {
//           if (stockItem.inventoryId) {
//             await tx.inventory.update({
//               where: { id: stockItem.inventoryId },
//               data: { stockQty: { decrement: stockItem.quantity } }
//             });
//           } else {
//             await tx.inventory.create({
//               data: {
//                 productId: stockItem.productId,
//                 branchId: targetBranchId,
//                 stockQty: -stockItem.quantity
//               }
//             });
//           }
//         }
//       }

//       // Update customer loyalty points if a customer profile is attached
//       if (customerRecordId) {
//         const netPointChange = earnedPoints - pointsToDeduct;
//         await tx.customer.update({
//           where: { id: customerRecordId },
//           data: { loyaltyPoints: { increment: netPointChange } }
//         });
//       }

//       // Handle Credit / Yeketena payments
//       if (paymentMethod === 'CREDIT' && customerRecordId) {
//         await tx.creditLedger.create({
//           data: {
//             customerId: customerRecordId,
//             saleId: sale.id,
//             recordedById: req.user.userId,
//             amountOwed: finalGrandTotal,
//             notes: `Yeketena credit sale from ${branch.name} (${currentTerminal}) for receipt ${receiptNo}`
//           }
//         });

//         await tx.customer.update({
//           where: { id: customerRecordId },
//           data: { totalCredit: { increment: finalGrandTotal } }
//         });
//       }

//       return sale;
//     });

//     res.status(201).json({
//       status: 'success',
//       message: `Sale completed successfully at ${branch.name}`,
//       data: result
//     });

//   } catch (error) {
//     console.error('POS Sale Error:', error);
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// // Get recent sales history
// const getSalesHistory = async (req, res) => {
//   try {
//     const sales = await prisma.sale.findMany({
//       include: { 
//         items: { include: { product: true } },
//         customer: true,
//         cashier: { select: { fullName: true } },
//         branch: true
//       },
//       orderBy: { createdAt: 'desc' },
//       take: 50
//     });
//     res.status(200).json({ status: 'success', data: sales });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// // Secure Refund Transaction with branch-specific inventory restocking
// const refundSale = async (req, res) => {
//   try {
//     const { saleId } = req.params;

//     if (req.user.role !== 'ADMIN' && !req.user.canRefund) {
//       return res.status(403).json({ 
//         status: 'error', 
//         message: 'Unauthorized: You do not have permission to process refunds.' 
//       });
//     }

//     const sale = await prisma.sale.findUnique({
//       where: { id: saleId },
//       include: { items: true, branch: true }
//     });

//     if (!sale) {
//       return res.status(404).json({ status: 'error', message: 'Sale record not found' });
//     }

//     const saleBranchId = sale.branchId;
//     const isWarehouseSale = sale.branch?.isWarehouse || false;

//     // Execute refund transaction to restock correct branch inventory
//     await prisma.$transaction(async (tx) => {
//       for (const item of sale.items) {
//         if (isWarehouseSale) {
//           await tx.product.update({
//             where: { id: item.productId },
//             data: { stockQty: { increment: item.quantity } }
//           });
//         } else if (saleBranchId) {
//           await tx.inventory.upsert({
//             where: {
//               productId_branchId: {
//                 productId: item.productId,
//                 branchId: saleBranchId
//               }
//             },
//             update: { stockQty: { increment: item.quantity } },
//             create: {
//               productId: item.productId,
//               branchId: saleBranchId,
//               stockQty: item.quantity
//             }
//           });
//         }
//       }

//       await tx.sale.update({
//         where: { id: saleId },
//         data: { status: 'REFUNDED' }
//       });
//     });

//     res.status(200).json({ status: 'success', message: 'Sale successfully refunded and branch inventory restocked' });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// module.exports = { 
//   createSale, 
//   getSalesHistory, 
//   refundSale 
// };
const prisma = require('../config/db');
const { sendTelegramReceipt } = require('../routes/telegramRoutes');

// Process a POS sale transaction with Branch-Specific Inventory Tracking & Telegram Receipt Dispatch
const createSale = async (req, res) => {
  try {
    const { items, paymentMethod, customerName, customerPhone, terminalId, redeemPoints, branchId, telegramChatId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Cart is empty' });
    }

    const currentTerminal = terminalId || 'POS-1';

    // 0. Determine the active branch for this sale:
    let targetBranchId = branchId;
    if (!targetBranchId) {
      const cashierUser = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { branchId: true }
      });
      targetBranchId = cashierUser?.branchId;
    }

    if (!targetBranchId) {
      let centralWarehouse = await prisma.branch.findFirst({ where: { isWarehouse: true } });
      if (!centralWarehouse) {
        centralWarehouse = await prisma.branch.findFirst();
      }
      if (!centralWarehouse) {
        return res.status(400).json({ status: 'error', message: 'No active branch or warehouse configured in the system.' });
      }
      targetBranchId = centralWarehouse.id;
    }

    // Verify branch exists
    const branch = await prisma.branch.findUnique({ where: { id: targetBranchId } });
    if (!branch) {
      return res.status(404).json({ status: 'error', message: 'Assigned branch location not found.' });
    }

    // Find the active open shift for this cashier on this specific terminal
    const activeShift = await prisma.shift.findFirst({
      where: { userId: req.user.userId, status: 'OPEN', terminalId: currentTerminal }
    });

    let subTotalAmount = 0;
    const orderItemsData = [];
    const stockVerificationMap = [];

    // 1. Verify stock availability and handle custom unit price overrides
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(404).json({ status: 'error', message: `Product not found` });
      }

      let availableQty = 0;
      let branchInventoryRecord = null;

      if (branch.isWarehouse) {
        availableQty = product.stockQty;
      } else {
        branchInventoryRecord = await prisma.inventory.findUnique({
          where: { productId_branchId: { productId: product.id, branchId: targetBranchId } }
        });
        availableQty = branchInventoryRecord ? branchInventoryRecord.stockQty : 0;
      }

      if (availableQty < item.quantity) {
        return res.status(400).json({ 
          status: 'error', 
          message: `Insufficient stock for ${product.name} at ${branch.name}. Available: ${availableQty}, Requested: ${item.quantity}` 
        });
      }

      const effectiveUnitPrice = item.unitPrice !== undefined ? Number(item.unitPrice) : Number(product.unitPrice);
      const lineTotal = effectiveUnitPrice * item.quantity;
      subTotalAmount += lineTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: effectiveUnitPrice,
        totalPrice: lineTotal
      });

      stockVerificationMap.push({
        productId: product.id,
        quantity: item.quantity,
        isWarehouse: branch.isWarehouse,
        inventoryId: branchInventoryRecord?.id
      });
    }

    // Apply point redemption discount if requested
    let finalGrandTotal = subTotalAmount;
    let pointsToDeduct = 0;
    
    let customerRecordId = null;
    let customerRecord = null;

    if (customerPhone && customerName) {
      customerRecord = await prisma.customer.upsert({
        where: { phone: customerPhone },
        update: { fullName: customerName },
        create: { fullName: customerName, phone: customerPhone }
      });
      customerRecordId = customerRecord.id;

      if (redeemPoints && customerRecord.loyaltyPoints >= 100) {
        finalGrandTotal = Math.max(0, subTotalAmount - 100);
        pointsToDeduct = 100;
      }
    }

    // Generate receipt and ERCA Fiscal Counter
    const receiptNo = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const fiscalReceiptNumber = `FRC-${new Date().getFullYear()}-${randomDigits}`;

    const earnedPoints = Math.floor(finalGrandTotal / 10);

    // 2. Execute database transaction
    const result = await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          receiptNo,
          fiscalReceiptNumber,
          subTotal: subTotalAmount,
          grandTotal: finalGrandTotal,
          paymentMethod: paymentMethod || 'CASH',
          cashierId: req.user.userId,
          customerId: customerRecordId,
          terminalId: currentTerminal,
          shiftId: activeShift ? activeShift.id : null,
          branchId: targetBranchId, 
          items: { create: orderItemsData }
        },
        include: { items: { include: { product: true } }, cashier: { select: { fullName: true } }, customer: true, branch: true }
      });

      // Decrement stock quantities
      for (const stockItem of stockVerificationMap) {
        if (stockItem.isWarehouse) {
          await tx.product.update({
            where: { id: stockItem.productId },
            data: { stockQty: { decrement: stockItem.quantity } }
          });
        } else {
          if (stockItem.inventoryId) {
            await tx.inventory.update({
              where: { id: stockItem.inventoryId },
              data: { stockQty: { decrement: stockItem.quantity } }
            });
          } else {
            await tx.inventory.create({
              data: {
                productId: stockItem.productId,
                branchId: targetBranchId,
                stockQty: -stockItem.quantity
              }
            });
          }
        }
      }

      // Update customer loyalty points
      if (customerRecordId) {
        const netPointChange = earnedPoints - pointsToDeduct;
        await tx.customer.update({
          where: { id: customerRecordId },
          data: { loyaltyPoints: { increment: netPointChange } }
        });
      }

      // Handle Credit payments
      if (paymentMethod === 'CREDIT' && customerRecordId) {
        await tx.creditLedger.create({
          data: {
            customerId: customerRecordId,
            saleId: sale.id,
            recordedById: req.user.userId,
            amountOwed: finalGrandTotal,
            notes: `Yeketena credit sale from ${branch.name} (${currentTerminal}) for receipt ${receiptNo}`
          }
        });

        await tx.customer.update({
          where: { id: customerRecordId },
          data: { totalCredit: { increment: finalGrandTotal } }
        });
      }

      return sale;
    });

    // 📱 DEBUG & TELEGRAM RECEIPT DISPATCH
    console.log('----------------------------------------------------');
    console.log('🔍 CHECKOUT DEBUG - Received telegramChatId:', telegramChatId, typeof telegramChatId);
    console.log('----------------------------------------------------');

    const cleanChatId = telegramChatId ? telegramChatId.toString().trim() : '';

    if (cleanChatId !== '') {
      console.log('🚀 TRIGGERING sendTelegramReceipt for chat ID:', cleanChatId);
      sendTelegramReceipt(cleanChatId, {
        orderId: result.receiptNo,
        items: result.items,
        total: result.grandTotal,
        paymentMethod: result.paymentMethod
      }).catch(err => console.error('❌ Background Telegram send failed:', err));
    } else {
      console.log('⚠️ SKIPPED: telegramChatId was empty, null, or undefined!');
    }

    res.status(201).json({
      status: 'success',
      message: `Sale completed successfully at ${branch.name}`,
      data: result
    });

  } catch (error) {
    console.error('POS Sale Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get recent sales history
const getSalesHistory = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: { 
        items: { include: { product: true } },
        customer: true,
        cashier: { select: { fullName: true } },
        branch: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.status(200).json({ status: 'success', data: sales });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Secure Refund Transaction
const refundSale = async (req, res) => {
  try {
    const { saleId } = req.params;

    if (req.user.role !== 'ADMIN' && !req.user.canRefund) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Unauthorized: You do not have permission to process refunds.' 
      });
    }

    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: { items: true, branch: true }
    });

    if (!sale) {
      return res.status(404).json({ status: 'error', message: 'Sale record not found' });
    }

    const saleBranchId = sale.branchId;
    const isWarehouseSale = sale.branch?.isWarehouse || false;

    await prisma.$transaction(async (tx) => {
      for (const item of sale.items) {
        if (isWarehouseSale) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockQty: { increment: item.quantity } }
          });
        } else if (saleBranchId) {
          await tx.inventory.upsert({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: saleBranchId
              }
            },
            update: { stockQty: { increment: item.quantity } },
            create: {
              productId: item.productId,
              branchId: saleBranchId,
              stockQty: item.quantity
            }
          });
        }
      }

      await tx.sale.update({
        where: { id: saleId },
        data: { status: 'REFUNDED' }
      });
    });

    res.status(200).json({ status: 'success', message: 'Sale successfully refunded and branch inventory restocked' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { 
  createSale, 
  getSalesHistory, 
  refundSale 
};
