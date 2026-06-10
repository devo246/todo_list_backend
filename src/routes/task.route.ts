import express from 'express'
import { taskSchema } from '../validators/task.validator'
import verifyToken from '../middleware/auth.middleware'
import validate from '../middleware/validator.middleware'
import { postTask, getTasks, updateTask, deleteTask } from '../controllers/task.controller'

const router = express.Router()

router.post('/', verifyToken, validate(taskSchema), postTask)
router.get('/', verifyToken, getTasks)
router.put('/:id', verifyToken, validate(taskSchema), updateTask)
router.delete('/:id', verifyToken, deleteTask)

export default router