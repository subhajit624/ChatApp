import express from 'express';
import dotenv from 'dotenv';
dotenv.config({});
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDb from './db/connect.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import frontendGetRoute from './routes/frontendGetRoute.js';
import http from 'http';
import { Server } from 'socket.io';
import { Conversation } from './models/conversionModel.js';
import { Message } from './models/messageModel.js';

const app = express();

// Middleware
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/frontend', frontendGetRoute);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true
  }
});

// Track online users: Map<userId, socketId>
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  // Handle joining the socket room (store user's ID)
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("🟢 User joined:", userId);
  });

  // Handle sending a message via socket
  socket.on("send_message", async (data) => {
    const { senderId, receiverId, message } = data;

    if (!senderId || !receiverId || !message) return;

    try {
      // Save to DB (same as REST API logic)
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
          messages: []
        });
      }

      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        message
      });

      conversation.messages.push(newMessage._id);
      await conversation.save();

      // Emit to receiver if online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", {
          senderId,
          receiverId,
          message,
          time: newMessage.createdAt
        });
      }

      // Also send back to sender (optional)
      socket.emit("message_sent", {
        senderId,
        receiverId,
        message,
        time: newMessage.createdAt
      });

    } catch (error) {
      console.log("❌ Error sending message via socket:", error.message);
    }
  });

  // On disconnect
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Connect DB and start server
connectDb();
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
