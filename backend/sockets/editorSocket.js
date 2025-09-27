import Project from "../models/Project.js";

export default function editorSocket(io, socket) {
  socket.on("join-room", async ({ roomId }) => {
    const project = await Project.findOne({ roomId });
    if (!project) return socket.emit("error", "Project not found");

if (!project.participants.some(p => p.user.toString() === socket.data.user._id.toString())) {
      return socket.emit("error", "Access denied");
    }

    socket.join(roomId);
    console.log(`${socket.data.user.email} joined room ${roomId}`);
  });

  socket.on("code-change", async ({ roomId, codeType, value }) => {
    const project = await Project.findOne({ roomId });
    if (!project || !project.participants.includes(socket.data.user._id)) return;

    socket.to(roomId).emit("code-update", { codeType, value });
  });

  socket.on("sync-request", async ({ roomId }) => {
    const project = await Project.findOne({ roomId });
    if (!project || !project.participants.includes(socket.data.user._id)) return;

    socket.to(roomId).emit("sync-requested", { from: socket.id });
  });

  socket.on("sync-response", ({ roomId, html, css, js, to }) => {
    io.to(to).emit("sync-response", { html, css, js });
  });
}
