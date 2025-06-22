import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import { useState,useEffect } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add";
import Employee from "./pages/View";
import AdminAttendancePanel from "./pages/AdminAtt";
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);
  return (
    <div className="   lg:m-2 lg:mx-3 m-1 ">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-full pr-1 mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/Edit" element={<Employee token={token} />} />
                <Route path="/view-attendence" element={<AdminAttendancePanel/>}/>
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
