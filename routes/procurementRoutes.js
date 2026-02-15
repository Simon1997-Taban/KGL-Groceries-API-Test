const express = require('express');
const router = express.Router();
const procurementController = require('../controllers/procurementController');
const { validateProcurement } = require('../middleware/validation');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

/**
 * @swagger
 * /procurement:
 *   post:
 *     summary: Record new procurement
 *     description: Managers can record produce purchased by KGL
 *     tags: [Procurement]
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
 *               - produceType
 *               - date
 *               - time
 *               - tonnage
 *               - cost
 *               - dealerName
 *               - branch
 *               - contact
 *               - sellingPrice
 *             properties:
 *               produceName:
 *                 type: string
 *                 example: Bananas
 *               produceType:
 *                 type: string
 *                 example: Fruits
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-15
 *               time:
 *                 type: string
 *                 example: 14:30
 *               tonnage:
 *                 type: number
 *                 example: 150
 *               cost:
 *                 type: number
 *                 example: 500000
 *               dealerName:
 *                 type: string
 *                 example: John Dealer
 *               branch:
 *                 type: string
 *                 enum:
 *                   - Maganjo
 *                   - Matugga
 *               contact:
 *                 type: string
 *                 example: +256701234567
 *               sellingPrice:
 *                 type: number
 *                 example: 600000
 *     responses:
 *       201:
 *         description: Procurement recorded successfully
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only Managers can record procurement
 *   get:
 *     summary: Get all procurements
 *     description: Retrieve all procurement records
 *     tags: [Procurement]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of procurements retrieved successfully
 *       401:
 *         description: Unauthorized
 *
 * /procurement/{id}:
 *   get:
 *     summary: Get procurement by ID
 *     tags: [Procurement]
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
 *         description: Procurement retrieved successfully
 *       404:
 *         description: Procurement not found
 *   put:
 *     summary: Update procurement
 *     tags: [Procurement]
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
 *         description: Procurement updated successfully
 *       404:
 *         description: Procurement not found
 *   delete:
 *     summary: Delete procurement
 *     tags: [Procurement]
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
 *         description: Procurement deleted successfully
 *       404:
 *         description: Procurement not found
 */

// Routes
router.post(
  '/',
  authenticateToken,
  authorizeRole(['Manager']),
  validateProcurement,
  procurementController.recordProcurement
);

router.get('/', authenticateToken, procurementController.getAllProcurements);

router.get('/:id', authenticateToken, procurementController.getProcurementById);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['Manager']),
  validateProcurement,
  procurementController.updateProcurement
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['Manager']),
  procurementController.deleteProcurement
);

module.exports = router;
