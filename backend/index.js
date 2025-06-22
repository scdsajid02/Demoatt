import express from "express"
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/adminLogin.js";
import employeeRouter from "./routes/employee.js";
import employeeAuthRouter from "./routes/employeeLogin.js";
import studentRouter from "./routes/student.js";
import attendanceRouter from "./routes/attendenceRoute.js";
const app = express();

const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors())

app.use("/api/auth", authRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/employeeAuth", employeeAuthRouter);
app.use("/api/student",studentRouter)
app.use("/api/attendence",attendanceRouter)
app.get("/", (req, res) => {
  res.send("API  WORKING");
});

connectDB()
  .then(() => {
    app.listen(port, () => console.log("🚀 Server started on port:", port));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
  