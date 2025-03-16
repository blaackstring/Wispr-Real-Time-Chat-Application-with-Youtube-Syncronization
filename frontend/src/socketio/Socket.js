import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "";  //here chnage


let sockets = null; // 

export const connectSocket = (userId) => {
    if (!sockets) {  // ✅ Prevent duplicate connections
        sockets = io("https://wispr-chatapp.onrender.com", {
            query: { userId },
            autoConnect: true,
            reconnection: true,
        });

        sockets.on("connect", () => {
            console.log("✅ Socket connected!", sockets.id);
        });

        sockets.on("disconnect", () => {
            console.log("❌ Socket disconnected");
        });
    }

    return sockets;
};

export const disconnectSocket = () => {
    if (sockets && sockets.connected) {
        sockets.disconnect();
        console.log("❌ Socket manually disconnected");
        sockets = null; // ✅ Reset global variable
    }
};
