import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { sendMail } from "../config/nodemailer.js";


export default function chatSocket(io, socket) {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`📌 User ${socket.data.user?.name} joined room ${roomId}`);
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    console.log(`🚪 User ${socket.data.user?.name} left room ${roomId}`);
  });

  socket.on("send-message", async ({ roomId, message }) => {
    try {
      const user = socket.data.user;
      if (!user) return;

      const newChat = new Chat({
        projectId: roomId,
        sender: user._id,
        message,
      });
      await newChat.save();

      const populatedChat = await Chat.findById(newChat._id)
        .populate("sender", "name avatar");

      io.to(roomId).emit("receive-message", populatedChat);

    } catch (err) {
      console.error("Chat socket error:", err);
      socket.emit("chat-error", "Failed to send message.");
    }
  });
}
