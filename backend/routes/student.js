import express from "express";

import { addStudent, deleteStudent, updateStudent, getAllStudents } from "../controllers/studentcontroller.js";
import verifyEmployeeToken from "../middlewares/verifyEmployeeToken.js";

const studentRouter = express.Router()

studentRouter.post("/add-student",verifyEmployeeToken, addStudent)
studentRouter.get("/list-students",verifyEmployeeToken, getAllStudents)
studentRouter.put("/update-student/:id", updateStudent)
studentRouter.delete("/delete-student/:id", deleteStudent)

export default studentRouter