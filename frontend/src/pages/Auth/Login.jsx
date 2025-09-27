import { useState } from "react";
import { api } from "../../api/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();


  const location=useLocation();
  const from=location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      toast.success("Login Successful!");

      const pendingToken = localStorage.getItem("pendingInviteToken");
      const pendingRoom = localStorage.getItem("pendingInviteRoomId");

      if (pendingToken && pendingRoom) {
        navigate(`/invite/accept?token=${pendingToken}&roomId=${pendingRoom}`);
      } else {
        navigate(from);
      }
    } catch (err) {
      console.error(err);
      toast.error("Login Failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white/95 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600">Log in to continue your collaboration</p>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="mt-1 w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-purple-600 font-semibold hover:underline">
            Register Here
          </Link>
        </p>
        <p className="text-center text-gray-600 text-sm">
          Forgot your password?{" "}
          <Link to="/forgot-password" className="text-indigo-600 font-semibold hover:underline">
            Reset Here
          </Link>
        </p>
      </form>
    </div>
  );
}
