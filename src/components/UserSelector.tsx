import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

interface User {
  id: string;
  name: string;
}

export default function UserSelector({
  users,
  selectedUser,
  setSelectedUser,
}: {
  users: User[];
  selectedUser: string;
  setSelectedUser: (id: string) => void;
}) {
  return (
    <div className="max-w-4xl mx-auto flex justify-center">
      <Select.Root value={selectedUser} onValueChange={setSelectedUser}>
        <Select.Trigger
          aria-label="Select user profile"
          className="inline-flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
        >
          <Select.Value placeholder="Select user" />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="overflow-hidden rounded-md bg-white shadow-lg">
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-100 cursor-default">
              ▲
            </Select.ScrollUpButton>
            <Select.Viewport className="p-1">
              {users.map((user) => (
                <Select.Item
                  key={user.id}
                  value={user.id}
                  className="relative flex items-center rounded-sm px-8 py-2 text-sm text-gray-900 cursor-pointer select-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
                >
                  <Select.ItemText>{user.name}</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-100 cursor-default">
              ▼
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
