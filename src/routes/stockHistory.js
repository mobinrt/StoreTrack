// src/routes/stockHistory.js
const express = require('express');
const router = express.Router();
const stockHistoryController = require('../controllers/stockHistoryController');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/stock-history:
 *   get:
 *     summary: Get all stock history entries
 *     tags:
 *       - StockHistory
 *     parameters:
 *       - in: query
 *         name: item
 *         schema:
 *           type: string
 *         description: Filter by itemId
 *       - in: query
 *         name: changeType
 *         schema:
 *           type: string
 *           enum: [in, out]
 *         description: Filter by change type
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Max number of results to return (default 50)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default 1)
 *     responses:
 *       200:
 *         description: List of stock history entries
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       403:
 *         description: Forbidden (user not an admin).
 *       500:
 *         description: Server error.
 */
router.get('/', authenticate, requireRole('admin'), stockHistoryController.listStockHistory);

/**
 * @swagger
 * /api/stock-history/{id}:
 *   get:
 *     summary: Get stock history entry by ID
 *     tags:
 *       - StockHistory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: stockHistoryId of the entry
 *     responses:
 *       200:
 *         description: Stock history entry
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       403:
 *         description: Forbidden (user not an admin).
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Server error.
 */
router.get('/:id', authenticate, requireRole('admin'), stockHistoryController.getStockHistory);

module.exports = router;
