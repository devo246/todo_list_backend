import { Request, Response } from "express";
import TaskModel from "../models/Task";

// Post Task
export const postTask = async (req: Request, res: Response) => {
  try {
    const { title, isCompleted } = req.body;
    const newTask = await TaskModel.create({
      title,
      isCompleted,
      user: req.user.userId,
    });
    res.status(201).json({ newTask });
  } catch (error) {
    console.error("postTask error", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { completed } = req.query;
    const filter: any = {
      user: req.user.userId,
    };

    if (completed !== undefined) {
      filter.isCompleted = completed === "true";
    }

    const tasks = await TaskModel.find(filter).populate("user", "name -_id");

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("getAllTasks error", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { title, isCompleted } = req.body;

    const task = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, isCompleted },
      { new: true },
    );

    res.status(200).json({ task });
  } catch (error) {
    console.error("updateTask error", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const tasks = await TaskModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!tasks) return res.status(404).json({ message: "Task not find" });

    res.status(200).json({ message: "Deleted Done" });
  } catch (error) {
    console.error("deleteTask error", error);
    res.status(500).json({ message: "Server error" });
  }
};
