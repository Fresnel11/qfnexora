const express = require('express');
const { create, list, getById, update, remove, addDeposit } = require('../controllers/savingPlan.controller');
const { validate, savingPlanSchema, savingPlanDepositSchema } = require('../utils/validator');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /saving-plans:
 *   post:
 *     summary: Créer un plan d'épargne
 *     tags: [SavingPlan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SavingPlan'
 *     responses:
 *       201:
 *         description: Plan créé
 *       400:
 *         description: Erreur de validation
 */
router.post('/', authenticateToken, validate(savingPlanSchema), create);

/**
 * @swagger
 * /saving-plans:
 *   get:
 *     summary: Lister les plans d'épargne de l'utilisateur
 *     tags: [SavingPlan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des plans
 */
router.get('/', authenticateToken, list);

/**
 * @swagger
 * /saving-plans/{id}:
 *   get:
 *     summary: Récupérer un plan d'épargne par ID
 *     tags: [SavingPlan]
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
 *         description: Plan trouvé
 *       404:
 *         description: Plan non trouvé
 */
router.get('/:id', authenticateToken, getById);

/**
 * @swagger
 * /saving-plans/{id}:
 *   put:
 *     summary: Modifier un plan d'épargne (seulement si en cours)
 *     tags: [SavingPlan]
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
 *             $ref: '#/components/schemas/SavingPlan'
 *     responses:
 *       200:
 *         description: Plan modifié
 *       404:
 *         description: Plan non trouvé ou non modifiable
 */
router.put('/:id', authenticateToken, validate(savingPlanSchema), update);

/**
 * @swagger
 * /saving-plans/{id}:
 *   delete:
 *     summary: Supprimer un plan d'épargne (seulement si en cours)
 *     tags: [SavingPlan]
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
 *         description: Plan supprimé
 *       404:
 *         description: Plan non trouvé ou non supprimable
 */
router.delete('/:id', authenticateToken, remove);

/**
 * @swagger
 * /saving-plans/{id}/deposit:
 *   post:
 *     summary: Ajouter un dépôt manuel à un plan d'épargne
 *     tags: [SavingPlan]
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
 *             $ref: '#/components/schemas/SavingPlanDeposit'
 *     responses:
 *       200:
 *         description: Dépôt ajouté
 *       404:
 *         description: Plan non trouvé ou non modifiable
 *       400:
 *         description: Erreur de validation ou montant dépassé
 */
router.post('/:id/deposit', authenticateToken, validate(savingPlanDepositSchema), addDeposit);

module.exports = router; 