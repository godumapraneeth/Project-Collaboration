import { socket } from "./socket";


export const joinRoom=({roomId})=>{
    socket.emit("user-joined",{roomId});
};

export const leaveRoom=({roomId})=>{
    socket.emit("leave-room",{roomId});
};

export const onUpdateUsers=(cb)=>{
    socket.on("update-users",cb);
    return () => socket.off("update-users",cb);
};

export const onProjectDeleted=(cb) =>{
    socket.on("project-deleted",cb);
    return () => socket.off("project-deleted",cb);
}