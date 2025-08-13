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

module.exports = router;
