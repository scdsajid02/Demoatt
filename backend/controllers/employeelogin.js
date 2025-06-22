import employeeModel from "../models/EmployeeModel.js";
import transporter from "../config/nodemailer.js";
import EmployeeOtpModel from "../models/employeelogin.js";
import jwt from "jsonwebtoken";

// ✅ Send OTP to employee
export const sendEmployeeOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const employee = await employeeModel.findOne({ email });
    if (!employee) {
      return res.json({
        success: false,
        message: "Email not found, please contact admin",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expireAt = Date.now() + 10 * 60 * 1000; // 10 mins

    await EmployeeOtpModel.findOneAndUpdate(
      { email },
      { otp, expireAt },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Employee Login OTP",
      html: `Your OTP is <b>${otp}</b>. It will expire in 10 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ✅ Verify OTP and return token with employeeId
export const EmployeeVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.json({ success: false, message: "Email and OTP required" });
    }

    const otpRecord = await EmployeeOtpModel.findOne({ email });
    if (!otpRecord) {
      return res.json({
        success: false,
        message: "OTP not found, request a new one",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (otpRecord.expireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    const employee = await employeeModel.findOne({ email });
    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }

    // ✅ Now store employeeId in token
    const token = jwt.sign(
      { employeeId: employee._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // optional expiry
    );

    await EmployeeOtpModel.deleteOne({ email });

    res.json({
      success: true,
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get employee details (only if middleware sets req.employeeId)
export const getEmployeeDetails = async (req, res) => {
  try {
    const employeeId = req.employeeId;

    const employee = await employeeModel.findById(employeeId);
    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
