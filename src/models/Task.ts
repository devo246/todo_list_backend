import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter the task title"],
      maxlength: [100, "The title must be less than 100 characters."],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const TaskModel = mongoose.model("Task", taskSchema);
export default TaskModel;
