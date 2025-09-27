import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "../api/api";

export default function InviteUserForm({ roomId }) {
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter an email address.");
      return;
    }
    setIsInviting(true);
    try {
      const res = await api.post(`/projects/${roomId}/invite`, { email });
      toast.success(res.data.message || "Invitation sent successfully!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send invitation.");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="p-5 border-t bg-gray-50 rounded-b-lg">
      <h3 className="font-semibold text-gray-800 text-sm mb-3">
        Invite a Collaborator
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
          disabled={isInviting}
        />
        <button
          type="submit"
          disabled={isInviting}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 shadow-sm"
        >
          {isInviting ? "Sending..." : "Invite"}
        </button>
      </form>
    </div>
  );
}
