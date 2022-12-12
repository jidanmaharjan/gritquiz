import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Routes, Route, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//api imports
import { getProfile, renewToken } from "./apis/userApis";

//Pages imports
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";

//icons imports
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Adminpanel from "./pages/adminpanel/Adminpanel";
import axios from "axios";

function App() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessT") || sessionStorage.getItem("accessT") || null
  );

  const navigate = useNavigate();

  axios.interceptors.request.use((request) => {
    const token =
      localStorage.getItem("accessT") ||
      sessionStorage.getItem("accessT") ||
      null;
    request.headers.Authorization = `Bearer ${token}`;
    return request;
  });

  const {
    isLoading: isProfileLoading,
    data: profile,
    isError: isProfileError,
    error: profileError,
    isFetching: isProfileFetching,
    refetch: refetchProfile,
  } = useQuery(
    "profile",

    getProfile,
    {
      enabled: accessToken ? true : false,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: profileSuccessHandler,
      onError: profileErrorHandler,
    }
  );

  const {
    isLoading: isrenewTokenLoading,
    data: newToken,
    isError: isRenewTokenError,
    error: renewTokenError,
    isFetching: isRenewTokenFetching,
    refetch: refetchRenewToken,
  } = useQuery(
    "renewToken",

    renewToken,
    {
      enabled: false,
      retry: 2,
      onSuccess: (newToken) => renewTokenSuccessHandler(newToken),
      onError: renewTokenErrorHandler,
    }
  );

  function profileErrorHandler() {
    if (
      localStorage.getItem("refreshT") ||
      sessionStorage.getItem("refreshT")
    ) {
      refetchRenewToken();
    }
  }
  function profileSuccessHandler() {
    if (
      localStorage.getItem("refreshT") ||
      sessionStorage.getItem("refreshT")
    ) {
    }
  }
  function renewTokenSuccessHandler(newToken) {
    const local = localStorage.getItem("refreshT");
    const session = sessionStorage.getItem("refreshT");
    if (newToken) {
      if (local) {
        localStorage.setItem("accessT", newToken.token);
      }
      if (session) {
        sessionStorage.setItem("accessT", newToken.token);
      }
      console.log("setrenew");
      setAccessToken(newToken.token);
      setTimeout(refetchProfile(), 500);
    }
  }
  function renewTokenErrorHandler() {
    localStorage.removeItem("accessT");
    sessionStorage.removeItem("accessT");
    sessionStorage.removeItem("refreshT");
    localStorage.removeItem("refreshT");
    navigate("/");
    toast.error("Please Login again");
  }

  useEffect(() => {
    const refreshToken =
      localStorage.getItem("refreshT") ||
      sessionStorage.getItem("refreshT") ||
      null;
    if (!refreshToken) {
      navigate("/");
    }
  }, [profile, newToken]);

  if (localStorage.getItem("refreshT") || sessionStorage.getItem("refreshT")) {
    if (isProfileFetching) {
      return (
        <div className="w-full min-h-screen bg-blue-400 flex justify-center items-center">
          <AiOutlineLoading3Quarters className="text-white animate-spin text-3xl" />
        </div>
      );
    }
  }

  return (
    <div className="App w-full min-h-screen">
      <Routes>
        <Route path="/" element={<Login refetchProfile={refetchProfile} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adminpanel" element={<Adminpanel />} />
      </Routes>
    </div>
  );
}

export default App;
