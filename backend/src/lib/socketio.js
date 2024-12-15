import express from 'express';
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5173/"],

    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// used to store connectedUsers
const userSocketMap = {};

io.on("connection", (socket) => {
   console.log("Received a new connection", socket.id);
   const userId = socket.handshake.query.userId;

   if(userId && userId !== "") {
       userSocketMap[userId] = socket.id;

       // broadcast new user connection
       io.emit("getOnlineUsers", Object.keys(userSocketMap));
   }

   socket.on('disconnect', () => {
       console.log("Disconnected", socket.id);

       // delete connection from map
       delete userSocketMap[userId];

       // broadcast user disconnection
       io.emit("getOnlineUsers", Object.keys(userSocketMap));
   })
});

export { io, app, server };