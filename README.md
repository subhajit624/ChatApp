# 💬 MERN Chat Application

A real-time chat application built using the **MERN Stack (MongoDB, Express, React, Node.js)** that allows registered users to chat with each other securely.  
This project includes both **frontend** and **backend** implementations.

---

## 🚀 Features

- 🔐 **User Authentication** — Register, Login, and Logout using JWT with httpOnly cookies  
- 💬 **1-on-1 Chat** — Logged-in users can send and receive messages  
- 📡 **Real-time Messaging** — Messages appear instantly without page refresh *(if socket is integrated)*  
- 🧑‍🤝‍🧑 **All Users List** — View and start chatting with any registered user  
- 💾 **Message Storage** — All messages saved in MongoDB  
- 🎨 **Clean UI** — Built with React + Tailwind CSS  
- 🧠 **Protected Routes** — Only logged-in users can access the chat page  
- 🌐 **Cross-Origin Support** — Configured CORS for frontend-backend communication  

---

## 🧱 Tech Stack

### 🖥️ Frontend
- React (Vite)
- Axios
- Context API (for authentication)
- Tailwind CSS

### ⚙️ Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication (httpOnly Cookies)
- bcryptjs (for password hashing)
- dotenv (for environment variables)
- CORS
