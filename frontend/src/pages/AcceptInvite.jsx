import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [status, setStatus] = useState("Processing invitation...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const acceptInvite = async () => {
      const inviteToken =
        searchParams.get("token") || localStorage.getItem("pendingInviteToken");
      const roomId =
        searchParams.get("roomId") || localStorage.getItem("pendingInviteRoomId");

      if (!inviteToken || !roomId) {
        setStatus("Invalid invitation link.");
        toast.error("The invitation link is missing required information.");
        navigate("/dashboard");
        return;
      }

      localStorage.setItem("pendingInviteToken", inviteToken);
      localStorage.setItem("pendingInviteRoomId", roomId);

      if (!token) {
        setStatus("Please log in or register to accept the invitation.");
        toast.info("You need to log in to join the project.");
        navigate(`/login?invite=true`);
        return;
      }

      try {
        const res = await api.post("/projects/accept-invite", { token: inviteToken, roomId });
        setStatus("Success! Redirecting to project...");
        toast.success(res.data.message);
        localStorage.removeItem("pendingInviteToken");
        localStorage.removeItem("pendingInviteRoomId");
        navigate(`/project/${roomId}`);
      } catch (err) {
        if (err.response?.status === 403) {
          setStatus("This invitation is for another user. Log in with the invited email.");
          toast.error("This invitation is for another user.");
        } else {
          setStatus(`Error: ${err.response?.data?.message || "Could not accept invitation."}`);
          toast.error(err.response?.data?.message || "Failed to accept invitation.");
        }
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    acceptInvite();
  }, [searchParams, navigate, token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="text-center p-8 bg-white/95 backdrop-blur-lg shadow-xl rounded-2xl w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Accepting Invitation</h1>
        <p className="mt-4 text-gray-600">{status}</p>
        {loading && (
          <div className="mt-6">
            <div className="inline-block w-10 h-10 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
