import React, { createContext, useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';


export const UserInfo = createContext();

const AuthContext = ({children}) => {

    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/frontend/me`, {
          withCredentials: true,
        });
        setAuthUser(res.data.user);
      } catch (err) {
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <UserInfo.Provider value={{authUser, setAuthUser,loading}}>
      {children}
    </UserInfo.Provider>
  )
}

export default AuthContext;
