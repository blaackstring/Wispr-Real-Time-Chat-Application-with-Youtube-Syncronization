import { log } from "console";
import express from "express";
import http from 'http';
import { Server } from "socket.io";


const app=express();

const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:  [process.env.ORIGIN || "http://localhost:5173"],
        methods:["GET","POST"]
    }
}); 

export const getReciverSocketId=(reciverid)=>{
    return userSocketMap[reciverid];
}

const userSocketMap={};


io.on("connection",(socket)=>{
    const userID=socket.handshake.query.userId
    if(userID!=='undefined') userSocketMap[userID]=socket.id
    io.emit('getOnlineUsers',Object.keys(userSocketMap))


    socket.on('disconnect',()=>{
        delete userSocketMap[userID];
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })
        
    socket.on("sendmyId", ({ userBid }) => {
        console.log({ userBid }, "from emit");
        const res = getReciverSocketId(userBid);
    console.log(res,"FORM SSEND ID");
    
        if (res) {
            console.log(res, "Hello from IO");
            console.log(`Emitting to socket ID: ${res}`);
            io.to(res).emit("recivedIDfromSocket", { userBid: res });
        } else {
            console.error("Receiver socket ID not found!");
        }
    });
    
})

export {io,app,server};