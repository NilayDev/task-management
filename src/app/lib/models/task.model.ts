import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },

    description: String,

    dueDate: Date,

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
    },

    category: {
      type: String,
      enum: ["work", "personal", "shopping"],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
