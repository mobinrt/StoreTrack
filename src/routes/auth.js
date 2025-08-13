const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Create a new user
 *     tags:
 *      - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: Ali
 *               password:
 *                 type: string
 *               role:
 *                 type: enum: [Admin, Staff]
 *     responses:
 *       201:
 *         description: User register
 */

router.post('/register', authController.register);


/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: login
 *     tags:
 *      - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Login user
 */

router.post('/login', authController.login);

module.exports = router;