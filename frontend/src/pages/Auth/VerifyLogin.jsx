import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/api.js";
import { toast } from "react-toastify";

export default function VerifyLogin() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.get(`/auth/verify/${token}`);
        toast.success("Email verified successfully!");
        navigate("/login");
      } catch (err) {
        console.error(err);
        toast.error("Invalid or expired verification link.");
      } finally {
        setLoading(false);
      }
    };
    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100">
      <div className="bg-white/90 p-10 rounded-2xl shadow-lg text-center space-y-4">
        {loading ? (
          <>
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
            <p className="text-lg font-medium text-gray-600">Verifying your email...</p>
          </>
        ) : (
          <p className="text-xl font-semibold text-green-600">Verification complete!</p>
        )}
      </div>
    </div>
  );
}
