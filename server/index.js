import {Server} from 'socket.io';
import express from 'express';


const app = express(); // Create an Express application

const httpServer = app.listen(3001, () => {
    console.log("WebSocket server is running on port 3001"); // Log server start
});


const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow requests from this origin
       
    },
}); // Create a new WebSocket server with CORS options




io.on("connection", (socket) => {
   console.log("New client connected:", socket.id, `${socket.id}`);

    //  handling a user joining a room
     socket.on("user_join_room", ({ username, roomId }) => {
        // below line current user  to join the particular  roomid
        socket.join(roomId); // Join the specified room
        console.log(`${username} joined room ${roomId}`); // Log the user joining the room
        
        // Notify other users in the room that a new user has joined
        socket.to(roomId).emit("user_join_room", `${username} has joined the room`); // Broadcast a message to other users in the room
       
    });
    // broadcasting a message to all users in the room
    socket.on("send_message", ({ username, roomId, text}) => {
        console.log(`${username} sent message to room ${roomId}: ${text}`); // Log the message
        socket.to(roomId).emit("receive_message", { username, text ,type: "regular"}); // Broadcast the message to all users in the room 
    })
    // handling a user leaving a room
    
    socket.on("user_left_room", ({ username, roomId }) => {
        socket.to(roomId).emit("message", { username, text: `${username} has left the chat`, type: "notif" })
    })
    
    //handling activity detection 
    socket.on("user_typing", ({ username, roomId }) => {
        socket.to(roomId).emit("user_typing", username)
    })
  

}); // Listen for new connections and log them