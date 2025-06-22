import React, { useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import axios from "axios";
const Add = ({ token }) => {
  const [name, setName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [studentClass, setStudentClass] = useState("");
  
  const [showButton, setShowButton] = useState(true);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setShowButton(false);
    try {
      const payload = {
        name,
        admissionNumber,
        
        studentClass,
      };
      const response = await axios.post(
        backendUrl + "/api/student/add-student",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIXED
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setAdmissionNumber("");
        
        setStudentClass("");
        setShowButton(true);
      } else {
        toast.error(response.data.message);
        setShowButton(true);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <h1 className="text-2xl font-bold">ADD STUDENT</h1>
      <div className="w-full mb-3">
        <p className="mb-3">NAME</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border-2 border-slate-800 rounded"
          type="text"
          placeholder="Student Name"
          required
        />
      </div>
      <div className="w-full mb-3">
        <p className="mb-3">ADMISSION NUMBER</p>
        <input
          onChange={(e) => setAdmissionNumber(e.target.value)}
          value={admissionNumber}
          className="w-full max-w-[500px] px-3 py-2 border-2 border-slate-800 rounded"
          
          placeholder="Unique Number"
          required
        />
      </div>
      
      <div className="w-full mb-3">
        <p className="mb-3">Class</p>
        <input
          onChange={(e) => setStudentClass(e.target.value)}
          value={studentClass}
          className="w-full max-w-[500px] px-3 py-2 border-2 border-slate-800 rounded"
          placeholder="Student Class"
          required
        />
      </div>
      {showButton ? (
        <button
          type="submit"
          className="w-28 cursor-pointer py-3 mt-4 bg-black text-white"
        >
          ADD
        </button>
      ) : (
        <p></p>
      )}
    </form>
  );
};

export default Add;
