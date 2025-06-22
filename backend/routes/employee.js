
import express from "express";
import {
  addEmployee,
  updateEmployee,
  getAllEmployees,
  deleteEmployee,
} from "../controllers/employeecontroller.js";

const employeeRouter = express.Router();

employeeRouter.post("/add-employee",  addEmployee);
employeeRouter.get("/list-employee", getAllEmployees);
employeeRouter.put("/update-employee/:id", updateEmployee);
employeeRouter.delete("/delete-employee/:id", deleteEmployee);

export default employeeRouter;
