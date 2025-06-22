import studentModel from "../models/StudentModel.js";

// ✅ Add Student — assigns current employee's ID to the student
export const addStudent = async (req, res) => {
  try {
    const { name, admissionNumber, studentClass } = req.body;
    const assignedEmployeeId = req.employeeId || req.body.assignedEmployeeId; // You can use middleware or manually pass

    if (!name || !admissionNumber || !studentClass || !assignedEmployeeId) {
      return res.json({
        success: false,
        message: "All fields including assignedEmployeeId are required",
      });
    }

    const existing = await studentModel.findOne({ admissionNumber });
    if (existing) {
      return res.json({
        success: false,
        message: "Student with this admission number already exists",
      });
    }

    const student = new studentModel({
      name,
      admissionNumber,
      studentClass,
      assignedEmployeeId,
    });

    await student.save();

    res.json({
      success: true,
      message: "Student added successfully",
      data: student,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get all students added by the logged-in employee
export const getAllStudents = async (req, res) => {
  try {
    const assignedEmployeeId = req.employeeId || req.query.employeeId;
    if (!assignedEmployeeId) {
      return res.json({
        success: false,
        message: "Employee ID is required to fetch students",
      });
    }

    const students = await studentModel
      .find({ assignedEmployeeId })
      .collation({ locale: "en", strength: 1 })
      .sort({ name: 1 });

    res.json({ success: true, data: students });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Update Student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, admissionNumber, studentClass } = req.body;

    const updatedStudent = await studentModel.findByIdAndUpdate(
      id,
      { name, admissionNumber, studentClass },
      { new: true }
    );

    if (!updatedStudent) {
      return res.json({ success: false, message: "Student not found" });
    }

    res.json({
      success: true,
      message: "Student details updated",
      data: updatedStudent,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await studentModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
