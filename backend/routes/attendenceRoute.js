import express from "express"

import { markStudentAttendance,getFilteredAttendance } from "../controllers/attendenceController.js"

const attendanceRouter = express.Router();

attendanceRouter.post("/mark",markStudentAttendance)
attendanceRouter.get("/get-attendence",getFilteredAttendance)

export default attendanceRouter