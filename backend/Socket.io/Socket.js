import express from "express";
import http from 'http';
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin:  [process.env.ORIGIN || "http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});

export const getReciverSocketId = (reciverid) => {
    return userSocketMap[reciverid];
};

const userSocketMap = {};

io.on("connection", (socket) => {
    const userID = socket.handshake.query.userId;

    if (userID) {
        socket.data.userID = userID; // ✅ Store in socket data for safe retrieval
        userSocketMap[userID] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on("send_url", ({ userId, targetId, vdourl }) => {
        if (!userId || !targetId || !vdourl) return;  
        
        const targetSocket = io.sockets.sockets.get(getReciverSocketId(targetId));
    
        const targetUserRooms = Array.from(targetSocket?.rooms || []);
        const isBusy = targetUserRooms.some(room => 
            room.includes("_") && room !== targetSocket?.id
        );
    
        if (isBusy) {
            console.log(`Target user ${targetId} is already busy in another room.`);
            return;
        }
    
        const roomId = [userId, targetId].sort().join("_");
    
        targetSocket?.join(roomId);  
        socket.join(roomId); 
        io.to(roomId).emit("receive_url", vdourl);
    });
    
    socket.on("play_pause", ({ userId, targetId, state }) => {
        if (!userId || !targetId) return;  
    
        const targetSocket = io.sockets.sockets.get(getReciverSocketId(targetId));
    
      
        const roomId = [userId, targetId].sort().join("_");
        io.to(roomId).emit("update_state", state);
    });
    
    socket.on("seek", ({ userId, targetId, timestamp }) => {
        if (!userId || !targetId || timestamp === undefined) return;  
    
       
    
        const roomId = [userId, targetId].sort().join("_");
        io.to(roomId).emit("update_seek", timestamp);
    });
    
    socket.on('disconnect', () => {
        const disconnectedUserID = socket.data?.userID; // ✅ Access from socket data
        if (disconnectedUserID) {
            delete userSocketMap[disconnectedUserID];
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        }
    });
});

export { io, app, server };
