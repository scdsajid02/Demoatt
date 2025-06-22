import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-[15%] min-h-screen   border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-2 text-[15px]">
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/add"
        >
          <p className="hidden md:block">Add Employee</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/Edit"
        >
          <p className="hidden md:block">View Employee</p>
        </NavLink>
        
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/view-attendence"
        >
          <p className="hidden md:block">View Attendence</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
