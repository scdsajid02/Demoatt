import Attendance from "../models/AttendenceModel.js";
import studentModel from "../models/StudentModel.js";

// ✅ Utility: Convert to 00:00 IST (Indian Time)
function toISTMidnight(dateStr) {
  const utc = new Date(dateStr);
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(utc.getTime() + istOffset);
  ist.setUTCHours(0, 0, 0, 0);
  return new Date(ist.getTime() - istOffset); // back to UTC but 00:00 IST
}

// ✅ 1. Employee marks student attendance
export const markStudentAttendance = async (req, res) => {
  try {
    const { attendanceList } = req.body;

    if (!Array.isArray(attendanceList) || attendanceList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Attendance list is empty or invalid",
      });
    }

    for (const record of attendanceList) {
      const { studentId, employeeId, date, status } = record;
      if (!studentId || !employeeId || !date || !status) continue;

      const attendanceDate = toISTMidnight(date);

      await Attendance.findOneAndUpdate(
        { studentId, date: attendanceDate },
        { employeeId, status },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    res.json({ success: true, message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Mark Attendance Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ 2. View attendance by employee and date
export const getFilteredAttendance = async (req, res) => {
  try {
    const { employeeId, date } = req.query;

    if (!employeeId || !date) {
      return res.status(400).json({
        success: false,
        message: "employeeId and date are required",
      });
    }

    const startDate = toISTMidnight(date);
    const endDate = new Date(startDate);
    endDate.setUTCHours(23, 59, 59, 999);

    // 🔁 Only fetch students assigned to this employee
    const students = await studentModel.find({
      assignedEmployeeId: employeeId,
    });

    const attendanceRecords = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    });

    const attendanceMap = {};
    attendanceRecords.forEach((record) => {
      attendanceMap[record.studentId.toString()] = record.status;
    });

    const data = students.map((student) => ({
      studentId: student._id,
      name: student.name,
      admissionNumber: student.admissionNumber,
      studentClass: student.studentClass,
      status: attendanceMap[student._id.toString()] || "Not Marked",
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
