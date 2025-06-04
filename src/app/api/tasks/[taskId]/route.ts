import { NextResponse } from "next/server";
import Task from "../../../lib/models/task.model";
import dbConnect from "../../../lib/db";
import { Types } from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    await dbConnect();

    const { taskId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ message: "Invalid task ID" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const task = await Task.findOne({
      _id: taskId,
      userId: new Types.ObjectId(userId),
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task fetched successfully", task },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch task",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    await dbConnect();

    const { taskId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ message: "Invalid task ID" }, { status: 400 });
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    const deletedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { isDeleted: true },
      { new: true }
    );

    if (!deletedTask) {
      return NextResponse.json(
        { message: "Task not found or you are not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Task deleted successfully", task: null },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to delete task",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    await dbConnect();

    const { taskId } = params;

    if (!Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ message: "Invalid task ID" }, { status: 400 });
    }

    const body = await request.json();
    const { userId, title, status, category, dueDate } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      {
        title,
        status,
        category,
        dueDate,
      },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json(
        { message: "Task not found or you are not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Task updated successfully", task: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to update task",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


