import express from 'express'
import { taskSchema } from '../validators/task.validator'
import verifyToken from '../middleware/auth.middleware'
import validate from '../middleware/validator.middleware'
import { postTask, getTasks, updateTask, deleteTask } from '../controllers/task.controller'

const router = express.Router()

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: Finish the API documentation
 *               isCompleted:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *     responses:
 *       201:
 *         description: Task created successfully
 *       401:
 *         description: Authentication required
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, validate(taskSchema), postTask)

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get the authenticated user's tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter tasks by completion status
 *     responses:
 *       200:
 *         description: Tasks returned successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, getTasks)

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: Finish the updated task
 *               isCompleted:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Server error
 */
router.put('/:id', verifyToken, validate(taskSchema), updateTask)

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', verifyToken, deleteTask)

export default router