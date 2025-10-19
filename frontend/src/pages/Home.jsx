import React, { useContext } from 'react'
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ComicText } from "@/components/magicui/comic-text";
import { WarpBackground } from "@/components/magicui/warp-background";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserInfo } from '@/contexts/AuthContext';
import axios from 'axios';

const Home = () => {

    const {authUser, setAuthUser} = useContext(UserInfo);
    const navigate = useNavigate();

    const gotoAllUserPage = () => {
      if(authUser){
      navigate("/chat");
    } else {
      toast.error("Please login first");
      navigate("/login");
    }
    }
    
    const gotoLoginPage = async() => {
        if(authUser) {
         try {
             const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`,{},{ withCredentials: true });
             setAuthUser(null);
             toast.success(res.data.message);
         } catch (error) {
            console.error("Error during logout:", error);
            toast.error("Logout failed. Please try again.");
          
         }
        } else {
            navigate("/login");
        }
    }

  return (
    <div className='bg-gray-200 h-screen w-screen px-6'>
       <div className="flex items-center justify-between">
            <img className="h-[100px] w-auto" src="/logo.png" alt="Logo" />
            <ShimmerButton className="h-8 px-4" onClick={gotoLoginPage}> {authUser ? "LogOut" : "LogIn"}</ShimmerButton>
       </div>

    <WarpBackground className="bg-gray-200">
         <div className={"flex flex-col items-center justify-center h-full mt-35"}>
            <div>
              <ComicText fontSize={2}>{authUser ? "Welcome Back" : ""}</ComicText>
                <ComicText fontSize={2}>{authUser ? authUser.fullname.split(" ")[0] : "Want to talk?"}</ComicText>
            </div>
          </div>  
           <div className={"flex flex-col items-center justify-center h-full"}>
                <InteractiveHoverButton className="bg-yellow-300 mt-35 " onClick={gotoAllUserPage}>Get Started</InteractiveHoverButton>
            </div>
    </WarpBackground>
    </div>
  )
}

export default Home
