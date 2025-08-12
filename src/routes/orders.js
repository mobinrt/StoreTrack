const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.post('/', ordersController.createOrder);
router.get('/', ordersController.listOrders);
router.get('/:id', ordersController.getOrder);
router.put('/:id/status', ordersController.updateOrderStatus);

module.exports = router;
