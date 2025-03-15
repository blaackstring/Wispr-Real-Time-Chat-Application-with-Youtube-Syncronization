import { log } from "console";
import express from "express";
import http from 'http';
import { Server } from "socket.io";


const app=express();
let l= [process.env.ORIGIN || "http://localhost:5173"]
const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin: "http://localhost:5173",
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

})

export {io,app,server};