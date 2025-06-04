import { NextResponse } from "next/server";
import dbConnect from "../../lib/db";
import Task from "../../lib/models/task.model";
import { Types } from "mongoose";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "Missing userId query parameter" },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const tasks = await Task.find({
      userId: new Types.ObjectId(userId),
      isDeleted: false,
    }).sort({ position: 1 });

    return NextResponse.json(
      { message: "Tasks fetched successfully", tasks },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch tasks",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { userId, title, description, status, dueDate, category } = data;

    if (!userId || !title) {
      return NextResponse.json(
        { message: "userId and title are required" },
        { status: 400 }
      );
    }

    // Parse and normalize the dueDate string (e.g. "2025-06-04")
    let parsedDueDate: Date | undefined;
    if (dueDate) {
      const [year, month, day] = (dueDate as string).split("-").map(Number);
      parsedDueDate = new Date(Date.UTC(year, month - 1, day));
    }

    // Determine the new task's position as the end of the user's current task list
    // 1) Count how many existing tasks this user already has
    const existingCount = await Task.countDocuments({ userId });

    // 2) That count is the new task's position (0-based index)
    const newPosition = existingCount;

    // Create the new task, including the computed position
    const task = await Task.create({
      userId,
      title,
      description,
      status,
      category,
      dueDate: parsedDueDate,
      position: newPosition,
    });

    return NextResponse.json(
      { message: "Task created successfully", task },
      { status: 201 }
    );
  } catch (error) {
    console.error("Task creation failed:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId" },
        { status: 400 }
      );
    }
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { message: "No updates provided" },
        { status: 400 }
      );
    }
    const results = [];
    for (const update of updates) {
      const { taskId, position } = update;
      if (!taskId || !Types.ObjectId.isValid(taskId)) {
        results.push({ taskId, status: "error", message: "Invalid taskId" });
        continue;
      }
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, userId },
        { position },
        { new: true }
      );
      if (updatedTask) {
        results.push({ taskId, status: "success", task: updatedTask });
      } else {
        results.push({
          taskId,
          status: "error",
          message: "Not found or unauthorized",
        });
      }
    }
    return NextResponse.json(
      { message: "Bulk update complete", results },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to process bulk update",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
