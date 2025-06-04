import React from "react";
import { Task } from "../app/type";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";

interface Props {
  tasks: Task[];
  onDragEnd: (result: DropResult) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskColumn = React.memo(function TaskColumn({
  status,
  tasks,
  onEdit,
  onDelete,
}: {
  status: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <div className="flex flex-col pb-4">
      <h3 className="text-lg font-semibold mb-3 capitalize tracking-wide text-gray-800 py-2">
        {status === "all-tasks" ? "All Tasks" : status.replace("-", " ")}
      </h3>

      <Droppable droppableId={status} key={status}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`bg-white rounded-xl shadow-sm p-3 flex flex-col gap-2 transition-colors ${
              snapshot.isDraggingOver ? "bg-blue-50" : "bg-white"
            }`}
            style={{ minHeight: 250 }}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`relative bg-gray-50 p-3 rounded-lg gap-2 shadow-sm transition-colors duration-200 cursor-pointer ${
                      snapshot.isDragging
                        ? "shadow-md border border-blue-300 bg-blue-50"
                        : "hover:shadow-md"
                    }`}
                  >
                    {/* Title with Edit beside it and Delete at far right */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-base text-gray-900 truncate">
                          {task.title}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                          }}
                          className="text-blue-500 hover:text-blue-600 cursor-pointer"
                          aria-label="Edit task"
                        >
                          <Pencil2Icon className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task);
                          }}
                          className="text-red-500 hover:text-red-600 cursor-pointer"
                          aria-label="Delete task"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {task.description}
                    </p>

                    {/* Meta info in a compact grid */}
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mt-3">
                      <div>
                        <p className="font-semibold text-gray-700">Category</p>
                        <p className="mt-0.5 truncate">{task.category}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">Status</p>
                        <p className="mt-0.5 truncate">{task.status}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">Due</p>
                        <p className="mt-0.5">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
});

export default function TaskColumns({
  tasks,
  onDragEnd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="max-w-7xl mx-auto">
        <TaskColumn
          status="all-tasks"
          tasks={tasks}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </DragDropContext>
  );
}
