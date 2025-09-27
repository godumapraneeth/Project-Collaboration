import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { api } from "../api/api.js";
import { connectSocket, socket } from "../sockets/socket.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateTokenAndFetchUser = async () => {
      if (token) {
        try {
          const res = await api.get("/profile");
          setUser(res.data.user);
          connectSocket(token);
        } catch (err) {
          console.error("Auth validation failed:", err);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    validateTokenAndFetchUser();
  }, [token]);

  const login = async (newToken, userDetails) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userDetails); 
    connectSocket(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    if (socket && socket.connected) socket.disconnect();
  };

  const value = useMemo(
    () => ({ token, user, loading, login, logout }),
    [token, user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);