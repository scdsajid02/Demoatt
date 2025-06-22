import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admissionNumber: { type: String, required: true, unique: true },
  studentClass: { type: String, required: true },
  assignedEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee", // ✅ NEW
    required: true,
  },
});

const studentModel =
  mongoose.models.student || mongoose.model("student", studentSchema);

export default studentModel;
