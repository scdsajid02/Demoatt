import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const AdminAttendancePanel = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceList, setAttendanceList] = useState([]);

  // 🔹 Fetch all employees for dropdown
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/employee/list-employee`);
      if (res.data.success) {
        setEmployees(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Error fetching employees");
    }
  };

  // 🔹 Fetch attendance for selected employee and date
  const fetchAttendance = async () => {
    if (!selectedEmployee || !date) return;

    try {
      const res = await axios.get(
        `${backendUrl}/api/attendence/get-attendence`,
        {
          params: {
            employeeId: selectedEmployee,
            date,
          },
        }
      );

      if (res.data.success) {
        setAttendanceList(res.data.data);
      } else {
        toast.error(res.data.message);
        setAttendanceList([]);
      }
    } catch (error) {
      toast.error("Error fetching attendance");
      setAttendanceList([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [selectedEmployee, date]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        Admin Panel - View Attendance
      </h2>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <div>
          <label className="block font-medium mb-1">Select Employee:</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="">-- Select --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-3 py-1 rounded"
          />
        </div>
      </div>

      {attendanceList.length > 0 ? (
        <div className="mt-4 border rounded shadow">
          <div className="grid grid-cols-[1.5fr_2.5fr_2fr_2fr] bg-gray-200 font-semibold text-center p-2">
            <div>Admission No</div>
            <div>Name</div>
            <div>Class</div>
            <div>Status</div>
          </div>

          {attendanceList.map((student) => (
            <div
              key={student.studentId}
              className="grid grid-cols-[1.5fr_2.5fr_2fr_2fr] text-center border-t p-2"
            >
              <div>{student.admissionNumber}</div>
              <div>{student.name}</div>
              <div>{student.studentClass}</div>
              <div
                className={
                  student.status === "Absent"
                    ? "text-red-600 font-semibold"
                    : "text-green-600 font-semibold"
                }
              >
                {student.status}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-6 text-gray-500">
          No attendance data found.
        </p>
      )}
    </div>
  );
};

export default AdminAttendancePanel;
