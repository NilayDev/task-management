"use client";

import React, { useState, useEffect } from "react";
import { Task, Status, Category } from "./type";
import { useQuery } from "@tanstack/react-query";
import UserSelector from "@/components/UserSelector";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import TaskColumns from "@/components/TaskColumns";
import TaskModal from "@/components/TaskModal";
import RadixSelect from "@/components/RadixSelect";

import {
  getUsers,
  fetchTasksByUser,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  reorderTasksApi,
} from "@/apiServices";

export default function TaskBoard() {
  const { data: userData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const users = React.useMemo(() => {
    if (!userData) return [];
    return userData.map((u: any) => ({ id: u._id, name: u.name }));
  }, [userData]);

  const [selectedUser, setSelectedUser] = useState<string>("");

  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0].id);
    }
  }, [users, selectedUser]);

  const {
    data: tasksData,
    isLoading: loadingTasks,
    refetch: refetchTasks,
  } = useQuery<Task[]>({
    queryKey: ["tasks", selectedUser],
    queryFn: () => fetchTasksByUser(selectedUser),
    enabled: !!selectedUser,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData);
    }
  }, [tasksData]);

  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");

  const filterTasks = (allTasks: Task[]) => {
    return allTasks.filter((task) => {
      if (filterStatus !== "all" && task.status !== filterStatus) return false;
      if (filterCategory !== "all" && task.category !== filterCategory)
        return false;
      if (
        searchText.trim() &&
        !(
          task.title.toLowerCase().includes(searchText.toLowerCase()) ||
          task.description.toLowerCase().includes(searchText.toLowerCase())
        )
      )
        return false;
      return true;
    });
  };

  const saveTask = async (
    formData: Omit<Task, "id" | "userId" | "status"> & { status?: Status }
  ) => {
    if (!selectedUser) return;
    const payload = {
      userId: selectedUser,
      ...formData,
      status: formData.status || "pending",
    };

    try {
      if (currentTask) {
        await updateTaskApi(currentTask.id, payload);
      } else {
        await createTaskApi(payload);
      }
      setIsModalOpen(false);
      setCurrentTask(null);
      await refetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || !selectedUser) return;

    const prevTasks = [...tasks];
    const fromIndex = prevTasks.findIndex((t) => t.id === draggableId);
    if (fromIndex === -1) return;

    const [movedTask] = prevTasks.splice(fromIndex, 1);
    prevTasks.splice(destination.index, 0, movedTask);

    setTasks(prevTasks);

    const updates = prevTasks.map((t, idx) => ({
      taskId: t.id,
      position: idx,
    }));

    try {
      await reorderTasksApi(selectedUser, updates);
    } catch (error) {
      console.error("Error updating task order:", error);
      await refetchTasks();
      alert("Failed to update task order. Please try again.");
    }
  };

  const deleteTask = async (id: string) => {
    if (!selectedUser) return;
    try {
      await deleteTaskApi(id, selectedUser);
      await refetchTasks();
    } catch {
      // If API fails, remove locally
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
    setTaskToDelete(null);
  };

  if (loadingUsers || loadingTasks) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    );
  }

  const statusOptions = ["all", "pending", "in-progress", "completed"] as const;
  const categoryOptions = ["all", "work", "personal", "shopping"] as const;

  const formatLabel = (s: string) => {
    if (s === "all") return "All";
    const withSpaces = s.replace(/-/g, " ");
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  };

  const parseLabelToKey = (label: string) => {
    const lower = label.toLowerCase();
    if (lower === "all") return "all";
    return lower.replace(/ /g, "-");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex justify-center">
      <div className="w-full max-w-7xl bg-white shadow-lg overflow-hidden">
        <div className="px-10 py-6">
          <h1 className="text-4xl font-semibold mb-6 text-gray-800 text-center">
            Task Management
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="text-gray-600 font-medium whitespace-nowrap">
                Switch User:
              </div>
              <div className="w-full sm:w-40">
                <UserSelector
                  users={users}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                />
              </div>
            </div>

            <button
              className="w-full sm:w-auto bg-gray-900 text-white rounded-lg px-6 py-2 font-medium hover:bg-black shadow-md focus:outline-none focus:ring-2 focus:ring-gray-600 transition-shadow cursor-pointer"
              onClick={() => {
                setCurrentTask(null);
                setIsModalOpen(true);
              }}
            >
              + New Task
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600 shadow-sm transition"
            />

            <RadixSelect<"All" | Status>
              label="Filter by status"
              options={statusOptions.map(formatLabel) as ("All" | Status)[]}
              value={formatLabel(filterStatus) as "All" | Status}
              onChange={(val) => {
                const key = parseLabelToKey(val);
                setFilterStatus(key as Status | "all");
              }}
            />

            <RadixSelect<"All" | Category>
              label="Filter by category"
              options={categoryOptions.map(formatLabel) as ("All" | Category)[]}
              value={formatLabel(filterCategory) as "All" | Category}
              onChange={(val) => {
                const key = parseLabelToKey(val);
                setFilterCategory(key as Category | "all");
              }}
            />
          </div>

          <TaskModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setCurrentTask(null);
            }}
            task={currentTask}
            onSave={saveTask}
          />

          <DeleteConfirmModal
            isOpen={!!taskToDelete}
            onClose={() => setTaskToDelete(null)}
            task={taskToDelete}
            onDelete={() => taskToDelete && deleteTask(taskToDelete.id)}
          />

          <TaskColumns
            tasks={filterTasks(tasks)}
            onDragEnd={onDragEnd}
            onEdit={(task) => {
              setCurrentTask(task);
              setIsModalOpen(true);
            }}
            onDelete={(task) => setTaskToDelete(task)}
          />
        </div>
      </div>
    </div>
  );
}
