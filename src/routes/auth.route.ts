// auth.route.ts
import express from "express";
import validate from "../middleware/validator.middleware";
import { userSchema, loginSchema } from "../validators/auth.validator";
import verifyToken from "../middleware/auth.middleware";
import {
  registerUser,
  loginUser,
  getUser,
  refreshAccessToken,
  logoutUser,
} from "../controllers/auth.controller";

const router = express.Router();

export default router;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth: # مجرد اسم
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: David
 *               email:
 *                 type: string
 *                 format: email
 *                 example: david@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Email already exists or validation failed
 *       500:
 *         description: Server error
 */
router.post("/register", validate(userSchema), registerUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: david@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Account not found, incorrect password, or validation failed
 *       500:
 *         description: Server error
 */
router.post("/login", validate(loginSchema), loginUser);

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get the authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user returned successfully
 *       401:
 *         description: Missing or malformed authorization header
 *       403:
 *         description: Invalid or expired access token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/me", verifyToken, getUser);

/**
 * @swagger
 * /api/refresh:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token returned successfully
 *       401:
 *         description: Refresh token cookie not found
 *       403:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", refreshAccessToken);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", logoutUser);