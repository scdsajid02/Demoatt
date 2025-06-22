import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  school: {
    type: String,

    required: true,
  },
});

const employeeModel =
  mongoose.models.employee || mongoose.model("employee", employeeSchema);

export default employeeModel;
