"use client";

import * as Dialog from "@radix-ui/react-dialog";
import RadixSelect from "./RadixSelect";

import { useState, useEffect } from "react";
import { Task, Category } from "../app/type";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (data: Omit<Task, "id" | "userId"> & { status?: string }) => void;
}

const categories = ["Work", "Personal", "Shopping"];
const statusOptions = ["pending", "in-progress", "completed"];

// Helper to turn "in-progress" → "In progress"
const formatStatusLabel = (s: string) => {
  const withSpaces = s.replace(/-/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

export default function TaskModal({ isOpen, onClose, task, onSave }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().slice(0, 10),
    category: "work",
    status: "pending",
  });

  useEffect(() => {
    if (isOpen && !task) {
      setForm({
        title: "",
        description: "",
        dueDate: new Date().toISOString().slice(0, 10),
        category: "work",
        status: "pending",
      });
    }
  }, [isOpen, task]);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate.slice(0, 10),
        category: task.category,
        status: task.status,
      });
    }
  }, [task]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md px-4 py-6 bg-white rounded-xl shadow-lg transform -translate-x-1/2 -translate-y-1/2 focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
            {task ? "Edit Task" : "Add New Task"}
          </Dialog.Title>

          <div className="flex flex-col gap-3">
            {/* Title Input */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter title"
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>

            {/* Description Input */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Enter description"
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            {/* Due Date */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
              />
            </div>

            {/* Category & Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <RadixSelect
                  label="Select task category"
                  options={categories}
                  value={
                    form.category.charAt(0).toUpperCase() +
                    form.category.slice(1)
                  }
                  onChange={(val) =>
                    setForm((f) => ({
                      ...f,
                      category: val.toLowerCase() as Category,
                    }))
                  }
                  className="text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <RadixSelect
                  label="Select task status"
                  options={statusOptions.map(formatStatusLabel)}
                  value={formatStatusLabel(form.status)}
                  onChange={(val) =>
                    setForm((f) => ({
                      ...f,
                      status: val.toLowerCase().replace(/ /g, "-"),
                    }))
                  }
                  className="text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <Dialog.Close asChild>
                <button
                  className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm transition cursor-pointer"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  disabled={!form.title.trim()}
                  className="px-5 py-1.5 bg-gray-900 text-white rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-700 text-sm transition disabled:opacity-50 cursor-pointer"
                  onClick={() => onSave(form)}
                >
                  {task ? "Save" : "Add"}
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
