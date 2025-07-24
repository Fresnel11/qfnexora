const express = require('express');
const { create, list, getById, update, remove } = require('../controllers/transaction.controller');
const { validate, transactionSchema } = require('../utils/validator');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Créer une transaction
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction créée
 *       400:
 *         description: Erreur de validation
 */
router.post('/', authenticateToken, validate(transactionSchema), create);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Lister les transactions de l'utilisateur
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrer par type (deposit, withdrawal, transfer)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrer par statut (pending, success, failed)
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *         description: Filtrer par devise
 *     responses:
 *       200:
 *         description: Liste des transactions
 */
router.get('/', authenticateToken, list);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Récupérer une transaction par ID
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction trouvée
 *       404:
 *         description: Transaction non trouvée
 */
router.get('/:id', authenticateToken, getById);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Modifier une transaction (seulement si source = manual)
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Transaction modifiée
 *       404:
 *         description: Transaction non trouvée ou non modifiable
 */
router.put('/:id', authenticateToken, validate(transactionSchema), update);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Supprimer une transaction (seulement si source = manual)
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction supprimée
 *       404:
 *         description: Transaction non trouvée ou non supprimable
 */
router.delete('/:id', authenticateToken, remove);

module.exports = router; 