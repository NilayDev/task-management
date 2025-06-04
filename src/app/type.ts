export type Status = "pending" | "in-progress" | "completed";
export type Category = "work" | "personal" | "shopping";

export interface User {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: Status;
  category: Category;
  userId?: string;
}
