import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";

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

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
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
    const userId = req.user.userId
    const user = await UserModel.findById(userId).select('-password')
    if(!user) return res.status(404).json({ message: "User not found" })

    res.status(200).json({user});
  } catch (error) {
    console.error("getUser error", error);
    res.status(500).json({ message: "Server Error" });
  }
};
