const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

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
 */
router.post('/', itemsController.createItem);

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
 */
router.get('/', itemsController.listItems);

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
 *       404:
 *         description: Item not found
 */
router.get('/:id', itemsController.getItem);

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
 *       404:
 *         description: Item not found
 */
router.put('/:id', itemsController.updateItem);

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
 *       404:
 *         description: Item not found
 */
router.delete('/:id', itemsController.deleteItem);


module.exports = router;