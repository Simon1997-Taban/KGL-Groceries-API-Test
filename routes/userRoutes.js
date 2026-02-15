const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateLogin } = require('../middleware/validation');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Login with username/email and password
 *     tags: [Users]
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
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 *
 * /users:
 *   post:
 *     summary: Create new user
 *     description: Create a new user account (Manager or Sales Agent)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: simon
 *               email:
 *                 type: string
 *                 example: simon@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum:
 *                   - Manager
 *                   - Sales Agent
 *               contact:
 *                 type: string
 *                 example: +256789121378
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request - user already exists
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users in the system
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
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
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

// Routes
router.post('/login', validateLogin, userController.login);

router.post('/', authenticateToken, validateUser, userController.createUser);

router.get('/', authenticateToken, userController.getAllUsers);

router.get('/:id', authenticateToken, userController.getUserById);

router.put('/:id', authenticateToken, userController.updateUser);

router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;
