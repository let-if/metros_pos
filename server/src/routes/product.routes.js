// server/src/routes/product.routes.js
// const express = require('express');
// const router = express.Router();
// const { 
//   getProducts, 
//   createProduct, 
//   deleteProduct, 
//   restockProduct 
// } = require('../controllers/product.controller');
// const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

// router.get('/', verifyToken, getProducts);
// router.post('/', verifyToken, requireAdmin, createProduct);
// router.patch('/:id/restock', verifyToken, restockProduct);
// router.delete('/:id', verifyToken, requireAdmin, deleteProduct);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  createProduct, 
  deleteProduct, 
  restockProduct,
  updateProductPrice // 👈 Imported controller function
} = require('../controllers/product.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', verifyToken, getProducts);
router.post('/', verifyToken, requireAdmin, createProduct);
router.patch('/:id/price', verifyToken, requireAdmin, updateProductPrice); // 👈 Secure price update route
router.patch('/:id/restock', verifyToken, restockProduct);
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);

module.exports = router;