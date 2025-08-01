import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);
  const [userRole, setUserRole] = useState("");

  const getUserData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        withCredentials: true,
      });
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendUrl]);

  const getUserRole = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/role", {
        withCredentials: true,
      });
      data.success ? setUserRole(data.userRole) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendUrl]);

  useEffect(() => {
    getUserRole();
  }, [getUserRole]);

  const getAuthState = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth", {
        withCredentials: true,
      });
      if (data && data.success) {
        setIsLoggedIn(true);
        getUserData();
        getUserRole();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
      // Only show toast for actual errors, not auth failures
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  }, [backendUrl, getUserData, getUserRole]);

  useEffect(() => {
    getAuthState();
  }, [getAuthState]);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    userRole,
    setUserRole,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
