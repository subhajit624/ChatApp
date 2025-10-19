import { useContext } from 'react';
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom"; 
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserInfo } from './contexts/AuthContext';
import ChatPage from './pages/ChatPage';

function App() {
  const { authUser, setAuthUser,loading } = useContext(UserInfo);

  if(loading){
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
 }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
