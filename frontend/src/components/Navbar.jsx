import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from "../App";
const Navbar = ({token, setToken }) => {
    const [employee, setEmployee] = useState(null);
  useEffect(() => {
    
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/employeeAuth/get-employee`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setEmployee(res.data.data);
        } else {
          setToken("");
        }
      } catch (err) {
        console.error("Failed to fetch employee:", err);
      }
    };

    fetchEmployee();
  }, []);
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <h1 className=" font-bold rubik text-3xl cursor-pointer text-red-600">
        {employee?.name || "HI"}
      </h1>
      <button
        onClick={() => setToken("")}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar