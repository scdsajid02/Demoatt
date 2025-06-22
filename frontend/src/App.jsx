import React from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from './components/Login';
import { useState,useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Add from './pages/Add';
import { Route, Routes } from 'react-router-dom';
import Employee from './pages/View';
import Attendance from './pages/Attendence';
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
const App = () => {
  const [token, setToken] = useState(localStorage.getItem("employeeToken") || "");
  useEffect(() => {
    localStorage.setItem("employeeToken", token);
  }, [token]);
  return (
    <div className="   lg:m-2 lg:mx-3 m-1 ">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar token={token} setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-full pr-1 mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/Edit" element={<Employee token={token} />} />
                <Route path='/attendence' element={<Attendance token={token}/>}/>
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;