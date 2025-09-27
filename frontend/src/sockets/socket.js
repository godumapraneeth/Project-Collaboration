import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false, 
});

export const connectSocket = (token) => {
  socket.auth = { token };
  if (!socket.connected) socket.connect();
};
