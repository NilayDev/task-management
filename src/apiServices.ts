import axios from "axios";
import { Status, Task } from "./app/type";

/**
 * Fetch all users.
 */
export async function getUsers(): Promise<{ _id: string; name: string }[]> {
  const response = await axios.get("/api/user");
  return response.data;
}

/**
 * Fetch tasks for a given userId.
 */
export async function fetchTasksByUser(userId: string): Promise<Task[]> {
  const res = await fetch(`/api/tasks?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  const data = await res.json();
  return data.tasks.map((t: any) => ({
    id: t._id,
    title: t.title,
    description: t.description || "",
    dueDate: t.dueDate,
    status: t.status === "in progress" ? "in-progress" : (t.status as Status),
    category: t.category,
    userId: t.userId,
  }));
}

/**
 * Create a new task.
 */
export async function createTaskApi(payload: Omit<Task, "id">): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

/**
 * Update an existing task (PUT).
 */
export async function updateTaskApi(
  id: string,
  payload: Omit<Task, "id">
): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

/**
 * Delete a task by ID and userId.
 */
export async function deleteTaskApi(id: string, userId: string) {
  const res = await fetch(`/api/tasks/${id}?userId=${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
}

/**
 * Reorder multiple tasks in one PATCH call.
 */
export async function reorderTasksApi(
  userId: string,
  updates: Array<{ taskId: string; position: number }>
) {
  const res = await fetch("/api/tasks", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, updates }),
  });
  if (!res.ok) throw new Error("Failed to update task order");
  return res.json();
}
