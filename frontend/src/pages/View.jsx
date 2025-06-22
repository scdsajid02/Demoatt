import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../App";

const Employee = ({ token }) => {
  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [deleteButtonId, setDeleteButtonId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    admissionNumber: "",
    studentClass: "",
  });

  const deleteEmployee = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to permanently delete this employee?\nNote: You won't be able to retrieve this data!"
      );
      if (!confirmed) return;
      const res = await axios.delete(
        `${backendUrl}/api/student/delete-student/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchList(); // Refresh the list
        setDeleteButtonId(null); // Hide delete button
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch employees list
  const fetchList = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/student/list-students",
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIXED
          },
        }
      );
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Start editing an employee
  const handleEditClick = (student) => {
    setEditMode(student._id);
    setEditData({
      
      name: student.name,
      admissionNumber: student.admissionNumber,
      studentClass: student.studentClass,
    });
  };
  const handldeleteClick = (employee) => {
    setDeleteButton(employee._id);
  };
  // Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save edited employee details
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/student/update-student/${editMode}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIXED
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setEditMode(null);
        fetchList(); // Refresh list after update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full">
      <p className="mb-2 text-2xl font-bold text-center">All Students List</p>

      <div className="md:grid grid-cols-[2.5fr_2fr_2fr_1fr] justify-items-center    py-1 px-2 border bg-gray-100 text-sm">
       
        <b>Name</b>
        <b>Unique Number</b>
        <b>Class</b>
        <b className="text-center">Action</b>
      </div>

      {list.map((item) => (
        <div
          key={item._id}
          className="grid md:grid-cols-[2.5fr_2fr_2fr_1fr]   justify-items-center   gap-2  px-2 border py-2 text-sm"
        >
          {editMode === item._id ? (
            <>
              
              <input
                name="name"
                value={editData.name}
                onChange={handleInputChange}
                className="border rounded px-1"
              />
              <input
                name="admissionNumber"
                value={editData.admissionNumber}
                onChange={handleInputChange}
                className="border rounded px-1"
              />
              <input
                name="studentClass"
                value={editData.studentClass}
                onChange={handleInputChange}
                className="border rounded px-1"
              />
              <div className="flex gap-1">
                <button
                  onClick={handleSave}
                  className="bg-green-500 px-2 rounded text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(null)}
                  className="bg-red-500 px-2 rounded text-white"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              
              <p>{item.name}</p>
              <p>{item.admissionNumber}</p>
              <p>{item.studentClass}</p>
              <div className="flex flex-col w-full items-center">
                <div className="flex gap-1 justify-around">
                  <p
                    className="text-right md:text-center px-2 py-1  cursor-pointer text-lg rounded border border-black"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </p>
                  {editMode ? null : (
                    <button
                      onClick={() =>
                        setDeleteButtonId((prev) =>
                          prev === item._id ? null : item._id
                        )
                      }
                      className="rotate-180 border-2 px-2 py-1 rounded border-black"
                    >
                      ^
                    </button>
                  )}
                </div>

                {deleteButtonId === item._id && (
                  <button
                    onClick={() => deleteEmployee(item._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded mt-1"
                  >
                    DELETE STUDENT
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Employee;
