const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { validateCashSales, validateCreditSales } = require('../middleware/validation');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

/**
 * @swagger
 * /sales/cash:
 *   post:
 *     summary: Record cash sale
 *     description: Sales agents record cash sales transactions
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produceName
 *               - tonnage
 *               - amountPaid
 *               - buyerName
 *               - salesAgentName
 *               - date
 *               - time
 *             properties:
 *               produceName:
 *                 type: string
 *                 example: Bananas
 *               tonnage:
 *                 type: number
 *                 example: 50
 *               amountPaid:
 *                 type: number
 *                 example: 250000
 *               buyerName:
 *                 type: string
 *                 example: Jane Buyer
 *               salesAgentName:
 *                 type: string
 *                 example: John Agent
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-15
 *               time:
 *                 type: string
 *                 example: 10:30
 *     responses:
 *       201:
 *         description: Cash sale recorded successfully
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only Sales Agents can record sales
 *
 * /sales/credit:
 *   post:
 *     summary: Record credit/deferred sale
 *     description: Sales agents record credit sales for trusted buyers
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - buyerName
 *               - nin
 *               - location
 *               - contact
 *               - amountDue
 *               - salesAgentName
 *               - dueDate
 *               - produceName
 *               - produceType
 *               - tonnage
 *               - dispatchDate
 *             properties:
 *               buyerName:
 *                 type: string
 *                 example: Jane Trader
 *               nin:
 *                 type: string
 *                 example: '12345678901234'
 *               location:
 *                 type: string
 *                 example: Kampala
 *               contact:
 *                 type: string
 *                 example: +256701234567
 *               amountDue:
 *                 type: number
 *                 example: 500000
 *               salesAgentName:
 *                 type: string
 *                 example: John Agent
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-15
 *               produceName:
 *                 type: string
 *                 example: Tomatoes
 *               produceType:
 *                 type: string
 *                 example: Vegetables
 *               tonnage:
 *                 type: number
 *                 example: 100
 *               dispatchDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-15
 *     responses:
 *       201:
 *         description: Credit sale recorded successfully
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only Sales Agents can record sales
 *
 * /sales:
 *   get:
 *     summary: Get all sales
 *     description: Retrieve all sales records (both cash and credit)
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sales retrieved successfully
 *       401:
 *         description: Unauthorized
 *
 * /sales/type/{type}:
 *   get:
 *     summary: Get sales by type
 *     description: Retrieve sales filtered by type (Cash or Credit)
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - Cash
 *             - Credit
 *     responses:
 *       200:
 *         description: Sales retrieved successfully
 *       401:
 *         description: Unauthorized
 *
 * /sales/{id}:
 *   get:
 *     summary: Get sale by ID
 *     tags: [Sales]
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
 *         description: Sale retrieved successfully
 *       404:
 *         description: Sale not found
 *   put:
 *     summary: Update sale
 *     tags: [Sales]
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
 *         description: Sale updated successfully
 *       404:
 *         description: Sale not found
 *   delete:
 *     summary: Delete sale
 *     tags: [Sales]
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
 *         description: Sale deleted successfully
 *       404:
 *         description: Sale not found
 */

// Routes
router.post(
  '/cash',
  authenticateToken,
  authorizeRole(['Sales Agent']),
  validateCashSales,
  salesController.recordCashSale
);

router.post(
  '/credit',
  authenticateToken,
  authorizeRole(['Sales Agent']),
  validateCreditSales,
  salesController.recordCreditSale
);

router.get('/', authenticateToken, salesController.getAllSales);

router.get('/type/:type', authenticateToken, salesController.getSalesByType);

router.get('/:id', authenticateToken, salesController.getSaleById);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['Sales Agent']),
  salesController.updateSale
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['Sales Agent']),
  salesController.deleteSale
);

module.exports = router;
