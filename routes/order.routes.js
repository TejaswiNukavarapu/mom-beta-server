const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  assignOrder,
  updateOrderStatus,
  updateOrderIsActive, 
} = require('../controllers/order.controllers');


router.post('/add-order', createOrder);


router.get('/allorders', getAllOrders);


router.get('/:id', getOrderById);


router.post('/:id/assign', assignOrder);


router.patch('/:id/status', updateOrderStatus);


router.patch('/:id/active', updateOrderIsActive);

module.exports = router;
