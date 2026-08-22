import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";

// auth.controller.ts

// Tokens دالة لانشاء الـ
const generateTokens = (userId: string) => {
  // Access Token
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_JWT_SECRET!, {
    expiresIn: "15m",
  });

  // Refresh Token
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_JWT_SECRET!, {
    expiresIn: "30d",
  });
  return { accessToken, refreshToken };
};

// Register User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPass,
    });

    const userObj = newUser.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    const { accessToken, refreshToken } = generateTokens(
      newUser._id.toString(),
    );

    // امنه Cookie في Refresh Token إرسال الـ
    // (key, value, {...})
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // JS يمنع الوصول اليه عبر
      // اثناء التطوير http لاننا نريد الموقع يشتغل علي false هناالقيمة بتساوي
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
      accessToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("registerUser", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "Account not found. Please register to continue." });

    const isMatchedPass = await bcrypt.compare(password, user.password);
    if (!isMatchedPass)
      return res
        .status(400)
        .json({ message: "Incorrect password. Please try again." });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get User
export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("getUser error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Refresh Controller
export const refreshAccessToken = (req: Request, res: Response) => {
  try {
    // من الكوكيز refreshToken استخراج
    const refreshToken = req.cookies.refreshToken;

    // refreshToken التحقق من وجود
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    // وفك تشفيرة Refresh Token التحقق من صحة
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET!,
    ) as { userId: string };

    // جديد Access Token اصدار
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_JWT_SECRET!,
      { expiresIn: "15m" },
    );

    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired refresh token",
    });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  // refreshToken اللي اسمها Cookie امسح الـ
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
};
