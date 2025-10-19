import { UserInfo } from '../contexts/AuthContext';
import React, { useContext, useState } from 'react';
import { Input } from "@/components/ui/input";
import { WarpBackground } from "@/components/magicui/warp-background";
import { Link, useNavigate } from 'react-router-dom';
import { ComicText } from "@/components/magicui/comic-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const { authUser, setAuthUser } = useContext(UserInfo);

  const handlesubmit = async () => {
    if (!gmail.trim() || !password.trim()){
      toast.error("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post( `${import.meta.env.VITE_BACKEND_URL}/api/users/login`, { gmail, password }, { withCredentials: true });

      if(res.data.success){
        setAuthUser(res.data.user);
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }

      setGmail('');
      setPassword('');
    } catch (error) {
      console.error("Error during login:", error);

      const errorMsg =
        error.response?.data?.message || "Login failed. Please try again.";

      toast.error(errorMsg);
    }
  };

  return (
    <WarpBackground className="h-screen w-screen flex items-center justify-center bg-gray-200">
      <div className="backdrop-blur-sm p-8 rounded-2xl shadow-lg w-[350px] space-y-4 border-2">
        <ComicText fontSize={2}>Login</ComicText>
        <br />
        <input onChange={(e) => setGmail(e.target.value)}  value={gmail} name="gmail" type="email" placeholder="Enter your Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input onChange={(e) => setPassword(e.target.value)} value={password} name="password" type="password" placeholder="Enter your Password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <br />
        <div className="flex justify-center">
          <ShimmerButton className="text-center h-xl w-xl" onClick={handlesubmit}>Submit</ShimmerButton>
        </div>
        <div className="text-sm text-center text-gray-600">
          Not registered yet?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </div>
      </div>
    </WarpBackground>
  );
};

export default Login;
