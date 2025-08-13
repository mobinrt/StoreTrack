const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order and deduct stock
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - item
 *                     - quantity
 *                   properties:
 *                     item:
 *                       type: string
 *                       example: 64da1e3d2d2e4b001f88b1a3
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Validation error or insufficient stock
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       500:
 *         description: Server error.
 */
router.post('/', authenticate, requireRole('admin, staff'), ordersController.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [waiting, sent, canceled]
 *         description: Filter orders by status
 *     responses:
 *       200:
 *         description: List of orders
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       403:
 *         description: Forbidden (user not an admin).
 *       500:
 *         description: Server error.
 */
router.get('/', authenticate, requireRole('admin'), ordersController.listOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
*        200:
*         description: Order details
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       403:
 *         description: Forbidden (user not an admin).
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error.
 */
router.get('/:id', authenticate, requireRole('admin'), ordersController.getOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update the status of an order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [waiting, sent, canceled]
 *                 example: canceled
 *     responses:
 *       200:
 *         description: Updated order
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       403:
 *         description: Forbidden (user not an admin).
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error.
 */
router.put('/:id/status', authenticate, requireRole('admin'), ordersController.updateOrderStatus);

module.exports = router;
