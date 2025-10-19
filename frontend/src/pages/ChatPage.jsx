import React, { useEffect, useState, useContext } from 'react';
import { UserInfo } from '../contexts/AuthContext';
import { WarpBackground } from "@/components/magicui/warp-background";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

const ChatPage = () => {
  const { authUser, setAuthUser } = useContext(UserInfo);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const navigate = useNavigate();

  const clickedlogout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      setAuthUser(null);
      toast.success(res.data.message);
      setSelectedUser(null);
      setMessages([]);
      setUsers([]);
      setInputMessage('');
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };

  const fetchMessages = async (receiverId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/${receiverId}`,
        { withCredentials: true }
      );
      setMessages(res.data);
    } catch (err) {
      console.log('Error fetching messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedUser) return;

    try {
      const messageData = {
        senderId: authUser._id,
        receiverId: selectedUser._id,
        message: inputMessage,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/send/${selectedUser._id}`,
        { message: inputMessage },
        { withCredentials: true }
      );

      socket.emit("send_message", messageData);

      setMessages((prev) => [...prev, res.data.newMessage]);
      setInputMessage('');
    } catch (err) {
      console.log('Error sending message:', err);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id);
  };

  const handleBack = () => {
    setSelectedUser(null);
    setMessages([]);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (authUser?._id) {
      socket.emit("join", authUser._id);
    }
  }, [authUser]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (selectedUser && data.senderId === selectedUser._id) {
        setMessages((prev) => [
          ...prev,
          {
            _id: Date.now(),
            sender: data.senderId,
            receiver: data.receiverId,
            message: data.message,
            createdAt: data.time,
          },
        ]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedUser]);

  return (
    <WarpBackground className="h-screen bg-gray-200 overflow-x-hidden">
      <div className="h-[calc(100vh-120px)] max-w-screen-lg mx-auto flex border border-black rounded-xl backdrop-blur-xl bg-white/10 overflow-hidden">

        {/* Desktop: Both sections visible */}
        <div className="hidden md:flex w-1/3 min-w-[250px] border-r border-black backdrop-blur-2xl bg-white/10 flex-col">
          <div className="flex justify-between border-b border-black bg-white/15 backdrop-blur-2xl p-4">
            <img
              onClick={clickedlogout}
              className="h-10 w-10 cursor-pointer"
              src="https://img.icons8.com/?size=100&id=89132&format=png&color=000000"
              alt="logout"
            />
            <div className="flex flex-col items-center gap-1">
              <img
                onClick={() => {}}
                className="h-10 w-10 rounded-full cursor-pointer border border-black"
                src={authUser.profilephoto}
                alt={authUser.fullname}
              />
              <h1 className="text-sm font-medium text-center">
                {authUser.fullname.split(' ')[0]}
              </h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {users.map((user) => (
              <div
                key={user._id}
                className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-blue-100 ${
                  selectedUser?._id === user._id ? 'bg-blue-100' : ''
                }`}
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={user.profilephoto}
                  alt={user.fullname}
                  className="h-10 w-10 rounded-full border border-black"
                />
                <div>
                  <p className="font-medium">{user.fullname}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col backdrop-blur-2xl bg-white/10">

          {/* MOBILE: Show user list if no user selected */}
          {!selectedUser && (
            <div className="md:hidden flex flex-col w-full h-full">
              <div className="flex justify-between border-b border-black bg-white/15 backdrop-blur-2xl p-4">
                <img
                  onClick={clickedlogout}
                  className="h-10 w-10 cursor-pointer"
                  src="https://img.icons8.com/?size=100&id=89132&format=png&color=000000"
                  alt="logout"
                />
                <h1 className="text-xl font-semibold">Select User</h1>
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-blue-100"
                    onClick={() => handleUserClick(user)}
                  >
                    <img
                      src={user.profilephoto}
                      alt={user.fullname}
                      className="h-10 w-10 rounded-full border border-black"
                    />
                    <div>
                      <p className="font-medium">{user.fullname}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show chat only if user is selected */}
          {selectedUser && (
            <div className="flex flex-col h-full w-full">
              <div className="flex items-center gap-4 p-4 bg-white/15 backdrop-blur-2xl border-b border-black">
                <button
                  className="md:hidden text-blue-500 font-semibold"
                  onClick={handleBack}
                >
                  ← Back
                </button>
                <img
                  src={selectedUser.profilephoto}
                  alt={selectedUser.fullname}
                  className="h-10 w-10 rounded-full border border-black"
                />
                <p className="text-lg font-semibold">{selectedUser.fullname}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`max-w-xs px-4 py-2 rounded-xl ${
                      msg.sender === authUser._id
                        ? 'bg-zinc-400 text-white ml-auto'
                        : 'bg-gray-300 text-black'
                    }`}
                  >
                    {msg.message}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white/15 backdrop-blur-2xl border-t border-black flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  className="w-full sm:flex-1 px-4 py-2 rounded-lg border border-black focus:outline-none"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  className="bg-zinc-900 text-white px-4 py-2 rounded-lg cursor-pointer"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </WarpBackground>
  );
};

export default ChatPage;
