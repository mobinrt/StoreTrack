const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     tags:
 *      - Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Apple
 *               category:
 *                 type: string
 *                 example: Fruit
 *               price:
 *                 type: number
 *                 example: 1.2
 *               stockQuantity:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Item created
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       403:
 *         description: Forbidden (user not an admin).
 *       500:
 *         description: Server error.
 */
router.post('/', authenticate, requireRole('admin'), itemsController.createItem);

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     tags:
 *      - Items
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by name (partial match)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 50
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *     responses:
 *       200:
 *         description: List of items
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       500:
 *         description: Server error.
 */
router.get('/', authenticate, requireRole('admin', 'staff'), itemsController.listItems);
/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item details
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       404:
 *         description: Item not found 
 *       500:
 *         description: Server error.
 */
router.get('/:id', authenticate, requireRole('admin', 'staff'), itemsController.getItem);
/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     tags:
 *       - Items
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
 *     responses:
 *       200:
 *         description: Updated item
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       403:
 *         description: Forbidden (user not an admin).
 *       404:
 *         description: Item not found 
 *       500:
 *         description: Server error.
 */
router.put('/:id', authenticate, requireRole('admin'), itemsController.updateItem);
/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted
 *       401:
 *         description: Unauthorized (missing or invalid token).
 *       403:
 *         description: Forbidden (user not an admin).
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error.
 */
router.delete('/:id', authenticate, requireRole('admin'), itemsController.deleteItem);

module.exports = router;