import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../App";

const Attendance = ({ token }) => {
  const [list, setList] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceData, setAttendanceData] = useState({});
  const [employee, setEmployee] = useState(null);

  // ✅ Fetch employee info
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
        toast.error("Failed to fetch employee info");
      }
    } catch (error) {
      toast.error("Error fetching employee data");
    }
  };

  // ✅ Fetch students assigned to this employee
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/student/list-students`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ FIXED
        },
        params: { employeeId: employee._id }, // ✅ pass employee ID
      });
      if (res.data.success) {
        setList(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Fetch previous attendance for selected date
  const fetchAttendance = async (selectedDate) => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/attendence/get-attendence`,
        {
          params: {
            date: selectedDate,
            employeeId: employee?._id,
          },
        }
      );

      if (res.data.success) {
        const attendanceMap = {};
        res.data.data.forEach((item) => {
          attendanceMap[item.studentId] = item.status;
        });
        setAttendanceData(attendanceMap);
      } else {
        toast.error(res.data.message);
        setAttendanceData({});
      }
    } catch (error) {
      toast.error(error.message);
      setAttendanceData({});
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    if (employee) {
      fetchStudents();
      fetchAttendance(date);
    }
  }, [employee, date]);

  // ✅ Mark attendance
  const handleStatusChange = async (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));

    try {
      const payload = [
        {
          studentId,
          employeeId: employee._id,
          date,
          status,
        },
      ];

      const res = await axios.post(
        `${backendUrl}/api/attendence/mark`,
        { attendanceList: payload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(`Marked ${status} for student`);
        fetchAttendance(date); // refresh view
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!employee) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Student Attendance
      </h2>

      <div className="mb-4 flex justify-center gap-4">
        <label htmlFor="attendance-date" className="font-semibold">
          Select Date:
        </label>
        <input
          type="date"
          id="attendance-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="grid grid-cols-[1.5fr_2.5fr_3fr_2fr] gap-2 bg-gray-100 p-2 font-semibold text-center rounded">
        <div>Adm No</div>
        <div>Name</div>
        <div>Class</div>
        <div>Status</div>
      </div>

      {list.map((student) => (
        <div
          key={student._id}
          className="grid grid-cols-[1.5fr_2.5fr_3fr_2fr] gap-2 items-center border-b py-2 text-center"
        >
          <div>{student.admissionNumber}</div>
          <div>{student.name}</div>
          <div>{student.studentClass || "-"}</div>
          <div>
            <select
              value={attendanceData[student._id] || ""}
              onChange={(e) => handleStatusChange(student._id, e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">-- Select --</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Attendance;
