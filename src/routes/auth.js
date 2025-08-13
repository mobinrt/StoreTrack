const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Auth
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
 *                 example: "mypassword123"
 *               role:
 *                 type: string
 *                 enum: [Admin, Staff]
 *     responses:
 *       201:
 *         description: User registered successfully
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