import express from "express";
import validate from "../middleware/validator.middleware";
import { userSchema, loginSchema } from "../validators/auth.validator";
import verifyToken from "../middleware/auth.middleware";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/auth.controller";

const router = express.Router();

router.post('/register', validate(userSchema), registerUser)
router.post('/login', validate(loginSchema), loginUser)
router.get('/me', verifyToken, getUser)

export default router