const Attendance = require("../models/Attendence");
const Student = require("../models/Student");

//mark attendance

const markAttnedance = async (req, res) => {
  try {
    const { student, date, status } = req.body;

    const attendance = new Attendance({
      student: student,
      date,
      status,
    });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Attendance already marked for this student on this date",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// get student attendance

const getStudentAttendance = async (req, res) => {
  try {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    let studentId;

    // If logged in user is student
    if (req.user.role === "student") {
      const student = await Student.findOne({ user: req.user._id });

      if (!student) {
        return res.status(404).json({ message: "Student record not found" });
      }

      // Force student to see only their own attendance
      studentId = student._id;
    } else {
      // Admin or Teacher can pass studentId in params
      studentId = req.params.studentId;
    }

    const totalAttendance = await Attendance.countDocuments({
      student: studentId,
    });

    const records = await Attendance.find({
      student: studentId,
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      records,
      totalAttendance,
      totalPages: Math.ceil(totalAttendance / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// get attendance by date

const getAttendanceByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);

    const records = await Attendance.find({
      date,
    }).populate("student", "name rollNumber");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// attendance summmary (percentage)

const getAttendanceSummary = async (req, res) => {
  try {
    let studentId;

    // If logged in user is student
    if (req.user.role === "student") {
      const student = await Student.findOne({ user: req.user._id });

      if (!student) {
        return res.status(404).json({ message: "Student record not found" });
      }

      // Force student to see only their own summary
      studentId = student._id;
    } else {
      // Admin or Teacher can pass studentId in params
      studentId = req.params.studentId;
    }

    const total = await Attendance.countDocuments({
      student: studentId,
    });
    const present = await Attendance.countDocuments({
      student: studentId,
      status: "Present",
    });
    const percentage = total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    res.status(200).json({
      totalDays: total,
      presentDays: present,
      attendancePercentage: percentage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  markAttnedance,
  getStudentAttendance,
  getAttendanceByDate,
  getAttendanceSummary,
};
