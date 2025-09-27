import { useEffect, useState } from "react";
import { socket } from "../../sockets/socket";

export default function UserList({ roomId, currentUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleUpdateUsers = (updatedUsers) => {
      setUsers(updatedUsers);
    };

    socket.on("update-users", handleUpdateUsers);
    return () => socket.off("update-users", handleUpdateUsers);
  }, [roomId]);

  if (!currentUser) return null;

  return (
    <div className="p-4 border-t">
      <h3 className="font-bold mb-3 text-gray-800">
        Active Users ({users.length})
      </h3>
      <ul className="space-y-2 text-sm">
        {users.map((user) => {
          const isYou = user._id === (currentUser._id || currentUser.id);
          return (
            <li
              key={user._id}
              className="flex items-center gap-2 text-gray-700"
            >
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || "User"
                  )}&background=random`
                }
                alt={user.name}
                className="w-6 h-6 rounded-full"
              />
              <span>{user.name || "Unknown"}</span>
              {isYou && (
                <span className="text-xs text-blue-600 font-semibold">(You)</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
