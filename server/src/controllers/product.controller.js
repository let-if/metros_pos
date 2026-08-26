
const prisma = require('../config/db');

// Get all products with low stock indicators
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Create a new product (Admin only) & Auto-Sync to Central Warehouse
const createProduct = async (req, res) => {
  try {
    const { sku, name, category, unitPrice, costPrice, stockQty, lowStockAlert } = req.body;

    if (!sku || !name || !category || unitPrice === undefined || costPrice === undefined) {
      return res.status(400).json({ status: 'error', message: 'Required product fields are missing' });
    }

    const parsedStockQty = parseInt(stockQty || 0);

    // Run product creation and warehouse inventory sync atomically
    const newProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          sku,
          name,
          category,
          unitPrice: parseFloat(unitPrice),
          costPrice: parseFloat(costPrice),
          stockQty: parsedStockQty,
          lowStockAlert: parseInt(lowStockAlert || 5),
        }
      });

      // Find or create the 'Central Warehouse' branch
      let centralWarehouse = await tx.branch.findFirst({
        where: { isWarehouse: true }
      });

      if (!centralWarehouse) {
        centralWarehouse = await tx.branch.create({
          data: { name: 'Central Warehouse', location: 'Addis Ababa Logistics Center', isWarehouse: true }
        });
      }

      // Upsert initial stock into Central Warehouse inventory
      await tx.inventory.upsert({
        where: {
          productId_branchId: {
            productId: product.id,
            branchId: centralWarehouse.id
          }
        },
        update: { stockQty: parsedStockQty },
        create: {
          productId: product.id,
          branchId: centralWarehouse.id,
          stockQty: parsedStockQty
        }
      });

      return product;
    });

    res.status(201).json({ status: 'success', message: 'Product added and synced to Central Warehouse successfully', data: newProduct });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ status: 'error', message: 'Product with this SKU already exists' });
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Restock product & Sync updated stock to Central Warehouse
const restockProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { addQty } = req.body;
    const qtyToAdd = parseInt(addQty);

    if (!addQty || isNaN(addQty) || qtyToAdd <= 0) {
      return res.status(400).json({ status: 'error', message: 'Please provide a valid restock quantity' });
    }

    const updatedProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id } });
      if (!product) {
        throw new Error('Product not found');
      }

      const newTotalStock = product.stockQty + qtyToAdd;

      // 1. Update master product stock
      const updated = await tx.product.update({
        where: { id },
        data: { stockQty: newTotalStock }
      });

      // 2. Find Central Warehouse
      let centralWarehouse = await tx.branch.findFirst({
        where: { isWarehouse: true }
      });

      if (!centralWarehouse) {
        centralWarehouse = await tx.branch.create({
          data: { name: 'Central Warehouse', location: 'Addis Ababa Logistics Center', isWarehouse: true }
        });
      }

      // 3. Update or create inventory record for Central Warehouse
      await tx.inventory.upsert({
        where: {
          productId_branchId: {
            productId: id,
            branchId: centralWarehouse.id
          }
        },
        update: { stockQty: { increment: qtyToAdd } },
        create: {
          productId: id,
          branchId: centralWarehouse.id,
          stockQty: newTotalStock
        }
      });

      return updated;
    });

    res.status(200).json({ status: 'success', message: 'Stock updated and synced to Central Warehouse successfully', data: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Add this function to your existing products.controller.js
const updateProductPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { unitPrice, costPrice, lowStockAlert } = req.body;

    const updateData = {};
    if (unitPrice !== undefined && !isNaN(unitPrice)) updateData.unitPrice = parseFloat(unitPrice);
    if (costPrice !== undefined && !isNaN(costPrice)) updateData.costPrice = parseFloat(costPrice);
    if (lowStockAlert !== undefined && !isNaN(lowStockAlert)) updateData.lowStockAlert = parseInt(lowStockAlert);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ 
      status: 'success', 
      message: 'Product price and settings updated successfully', 
      data: updatedProduct 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Make sure to include updateProductPrice in module.exports at the bottom:
module.exports = { getProducts, createProduct, deleteProduct, restockProduct, updateProductPrice };
