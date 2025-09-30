import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

import editorSocket from "./sockets/editorSocket.js";
import chatSocket from "./sockets/chatSocket.js";
import presenceSocket from "./sockets/presenceSocket.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// Connect to MongoDB
connectDB();

const corsOptions={
  origin:process.env.CLIENT_URL,
  credentials:true,
  optionsSuccessStatus:200
}
const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: {
     origin:process.env.CLIENT_URL,
     methods:["GET","POST"],
     credentials:true,    
    } });

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.set("io",io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/chat",chatRoutes)


app.get("/", (req, res) => res.send("Server is running..."));

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (!user) return next(new Error("Authentication error"));

    socket.data.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("🔌 New client connected", socket.id);

  editorSocket(io, socket);
  chatSocket(io, socket);
  presenceSocket(io, socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
