const express = require('express');
const { create, list, getById, update, remove } = require('../controllers/budget.controller');
const { validate, budgetSchema } = require('../utils/validator');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Créer un budget
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Budget'
 *     responses:
 *       201:
 *         description: Budget créé
 *       400:
 *         description: Erreur de validation
 */
router.post('/', authenticateToken, validate(budgetSchema), create);

/**
 * @swagger
 * /budgets:
 *   get:
 *     summary: Lister les budgets de l'utilisateur
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des budgets
 */
router.get('/', authenticateToken, list);

/**
 * @swagger
 * /budgets/{id}:
 *   get:
 *     summary: Récupérer un budget par ID
 *     tags: [Budget]
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
 *         description: Budget trouvé
 *       404:
 *         description: Budget non trouvé
 */
router.get('/:id', authenticateToken, getById);

/**
 * @swagger
 * /budgets/{id}:
 *   put:
 *     summary: Modifier un budget
 *     tags: [Budget]
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
 *             $ref: '#/components/schemas/Budget'
 *     responses:
 *       200:
 *         description: Budget modifié
 *       404:
 *         description: Budget non trouvé ou non modifiable
 */
router.put('/:id', authenticateToken, validate(budgetSchema), update);

/**
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     summary: Supprimer un budget
 *     tags: [Budget]
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
 *         description: Budget supprimé
 *       404:
 *         description: Budget non trouvé ou non supprimable
 */
router.delete('/:id', authenticateToken, remove);

module.exports = router; 