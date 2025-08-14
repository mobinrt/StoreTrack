const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/reports/low-stock:
 *   get:
 *     summary: Get list of low-stock items
 *     description: Returns a list of items whose stock quantity is below a given threshold. Requires admin role.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Stock quantity threshold to determine low stock.
 *     responses:
 *       200:
 *         description: Successful response with low-stock items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 threshold:
 *                   type: integer
 *                   example: 5
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       403:
 *         description: Forbidden (user not an admin).
 *       500:
 *         description: Server error.
 */
router.get('/low-stock', authenticate, requireRole('admin'), reportsController.lowStock);

/**
 * @swagger
 * /api/reports/sales:
 *   get:
 *     summary: Get sales report
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for report (inclusive)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for report (inclusive)
 *     responses:
 *       200:
 *         description: Sales report data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   example: 1234.56
 *                 totalOrders:
 *                   type: integer
 *                   example: 10
 *                 topSelling:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Apple
 *                       sold:
 *                         type: integer
 *                         example: 50
 *       500:
 *         description: Server error
 */
router.get('/sales', authenticate, requireRole('admin'), reportsController.salesReport);

module.exports = router;
