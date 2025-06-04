"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { Task } from "../app/type";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onDelete: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  task,
  onDelete,
}: Props) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-sm w-full p-6 rounded-xl bg-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Confirm Delete
          </Dialog.Title>
          <p className="mb-6">
            Are you sure you want to delete the task{" "}
            <span className="font-semibold">{task?.title}</span>?
          </p>
          <div className="flex justify-end gap-4">
            <Dialog.Close asChild>
              <button
                className="bg-gray-300 hover:bg-gray-400 rounded px-4 py-2 transition"
                onClick={onClose}
              >
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2 transition"
                onClick={onDelete}
              >
                Delete
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
