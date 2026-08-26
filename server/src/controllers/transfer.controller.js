
// const prisma = require('../config/db');

// // 1. Get all transfers
// const getTransfers = async (req, res) => {
//   try {
//     const transfers = await prisma.stockTransfer.findMany({
//       include: {
//         sourceBranch: true,
//         destBranch: true,
//         product: true
//       },
//       orderBy: { createdAt: 'desc' }
//     });
//     res.status(200).json({ status: 'success', data: transfers });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// // 2. Execute Stock Transfer with Central Warehouse & System Product Stock Integration
// const executeStockTransfer = async (req, res) => {
//   try {
//     const { sourceId, destId, productId, quantity, notes } = req.body;
//     const qty = parseInt(quantity);

//     if (!sourceId || !destId || !productId || qty <= 0) {
//       return res.status(400).json({ status: 'error', message: 'Invalid transfer details provided.' });
//     }

//     if (sourceId === destId) {
//       return res.status(400).json({ status: 'error', message: 'Source and destination branches cannot be the same.' });
//     }

//     const result = await prisma.$transaction(async (tx) => {
//       // 1. Fetch the source branch details to check if it's the Central Warehouse
//       const sourceBranch = await tx.branch.findUnique({ where: { id: sourceId } });
//       if (!sourceBranch) {
//         throw new Error('Source branch not found.');
//       }

//       // 2. Fetch the master product
//       const product = await tx.product.findUnique({ where: { id: productId } });
//       if (!product) {
//         throw new Error('Product not found.');
//       }

//       // --- SCENARIO A: Source is Central Warehouse (Integrates directly with system product stock) ---
//       if (sourceBranch.isWarehouse) {
//         if (product.stockQty < qty) {
//           throw new Error(`Insufficient stock in Central Warehouse (System Stock). Available: ${product.stockQty}, Requested: ${qty}`);
//         }

//         // Deduct from master system product stock
//         await tx.product.update({
//           where: { id: productId },
//           data: { stockQty: { decrement: qty } }
//         });
//       } 
//       // --- SCENARIO B: Source is a regular Retail Store Branch ---
//       else {
//         let sourceInv = await tx.inventory.findUnique({
//           where: { productId_branchId: { productId, branchId: sourceId } }
//         });

//         if (!sourceInv || sourceInv.stockQty < qty) {
//           const available = sourceInv ? sourceInv.stockQty : 0;
//           throw new Error(`Insufficient stock in ${sourceBranch.name}. Available: ${available}, Requested: ${qty}`);
//         }

//         // Deduct from store branch inventory
//         await tx.inventory.update({
//           where: { id: sourceInv.id },
//           data: { stockQty: { decrement: qty } }
//         });
//       }

//       // 3. Add to Destination Branch Inventory (upsert so it initializes if it doesn't exist yet)
//       await tx.inventory.upsert({
//         where: { productId_branchId: { productId, branchId: destId } },
//         update: { stockQty: { increment: qty } },
//         create: { productId, branchId: destId, stockQty: qty }
//       });

//       // 4. Create the immutable audit log record
//       const transfer = await tx.stockTransfer.create({
//         data: {
//           sourceId,
//           destId,
//           productId,
//           quantity: qty,
//           initiatedById: req.user?.userId || req.user?.id,
//           notes: notes || 'Stock transfer executed successfully'
//         },
//         include: { sourceBranch: true, destBranch: true, product: true }
//       });

//       return transfer;
//     });

//     res.status(201).json({
//       status: 'success',
//       message: 'Stock transferred successfully',
//       data: result
//     });

//   } catch (error) {
//     res.status(400).json({ status: 'error', message: error.message });
//   }
// };

// module.exports = { getTransfers, executeStockTransfer };
// server/src/controllers/transfer.controller.js
const prisma = require('../config/db');

const getTransfers = async (req, res) => {
  try {
    const transfers = await prisma.stockTransfer.findMany({
      include: {
        sourceBranch: true,
        destBranch: true,
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: transfers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const executeStockTransfer = async (req, res) => {
  try {
    const { sourceId, destId, productId, quantity, notes } = req.body;
    const qty = parseInt(quantity);

    if (!sourceId || !destId || !productId || qty <= 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid transfer details provided.' });
    }

    if (sourceId === destId) {
      return res.status(400).json({ status: 'error', message: 'Source and destination branches cannot be the same.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const sourceBranch = await tx.branch.findUnique({ where: { id: sourceId } });
      if (!sourceBranch) {
        throw new Error('Source branch not found.');
      }

      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) {
        throw new Error('Product not found.');
      }

      let remainingSourceStock = 0;

      // --- SCENARIO A: Source is Central Warehouse ---
      if (sourceBranch.isWarehouse) {
        if (product.stockQty < qty) {
          throw new Error(`Insufficient stock in Central Warehouse. Available: ${product.stockQty}, Requested: ${qty}`);
        }

        const updatedProduct = await tx.product.update({
          where: { id: productId },
          data: { stockQty: { decrement: qty } }
        });
        remainingSourceStock = updatedProduct.stockQty;
      } 
      // --- SCENARIO B: Source is a Retail Store Branch ---
      else {
        let sourceInv = await tx.inventory.findUnique({
          where: { productId_branchId: { productId, branchId: sourceId } }
        });

        if (!sourceInv || sourceInv.stockQty < qty) {
          const available = sourceInv ? sourceInv.stockQty : 0;
          throw new Error(`Insufficient stock in ${sourceBranch.name}. Available: ${available}, Requested: ${qty}`);
        }

        const updatedInv = await tx.inventory.update({
          where: { id: sourceInv.id },
          data: { stockQty: { decrement: qty } }
        });
        remainingSourceStock = updatedInv.stockQty;
      }

      // Add to Destination Branch Inventory
      await tx.inventory.upsert({
        where: { productId_branchId: { productId, branchId: destId } },
        update: { stockQty: { increment: qty } },
        create: { productId, branchId: destId, stockQty: qty }
      });

      // Create audit log record including remaining stock value in notes or metadata
      // (We can append it cleanly or store it in notes if needed, or structured)
      const transfer = await tx.stockTransfer.create({
        data: {
          sourceId,
          destId,
          productId,
          quantity: qty,
          initiatedById: req.user?.userId || req.user?.id,
          notes: notes ? `${notes} | Remaining Source Stock: ${remainingSourceStock}` : `Remaining Source Stock: ${remainingSourceStock}`
        },
        include: { sourceBranch: true, destBranch: true, product: true }
      });

      return { ...transfer, remainingSourceStock };
    });

    res.status(201).json({
      status: 'success',
      message: 'Stock transferred successfully',
      data: result
    });

  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

module.exports = { getTransfers, executeStockTransfer };