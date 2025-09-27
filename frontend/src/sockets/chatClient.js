import { socket } from "./socket";

export const sendMessage = (roomId, message) => {
  socket.emit("send-message", { roomId, message });
};

export const subscribeToMessage = (callback) => {
  const handler = (msg) => callback(msg);
  socket.on("receive-message", handler);
  return () => socket.off("receive-message", handler);
};

export const joinRoom = (roomId) => {
  socket.emit("join-room", roomId);
};

export const leaveRoom = (roomId) => {
  socket.emit("leave-room", roomId);
};
