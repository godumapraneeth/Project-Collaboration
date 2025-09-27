
const updateAndBroadcastUsers = async (io, roomId) => {
  try {
    const socketsInRoom = await io.in(roomId).fetchSockets();

    const usersInRoom = socketsInRoom.map((socket) => socket.data.user);

    io.to(roomId).emit("update-users", usersInRoom);
  } catch (error) {
    console.error(`Error updating users for room ${roomId}:`, error);
  }
};

export default function presenceSocket(io, socket) {
  socket.on("user-joined", ({ roomId }) => {
    const user = socket.data.user;
    if (!user || !user._id) {
      console.error("Join attempt by unidentified user failed.");
      return;
    }
    socket.join(roomId);
    updateAndBroadcastUsers(io, roomId);
  });

  socket.on("leave-room", ({ roomId }) => {
    socket.leave(roomId);
    updateAndBroadcastUsers(io, roomId);
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms].filter((r) => r !== socket.id);
    
    rooms.forEach((roomId) => {
      updateAndBroadcastUsers(io, roomId);
    });
  });
}