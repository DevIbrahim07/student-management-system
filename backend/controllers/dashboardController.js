const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Mark = require("../models/Mark");
const Attendance = require("../models/Attendence");

const getDashboardStats = async (req, res) => {
  try {
    // If student, show their specific stats
    if (req.user.role === "student") {
      const student = await Student.findOne({ user: req.user._id }).populate(
        "subjects",
      );

      if (!student) {
        return res.status(404).json({ message: "Student record not found" });
      }

      // Get student's marks
      const marks = await Mark.find({ student: student._id });
      const avgMarks =
        marks.length > 0
          ? (marks.reduce((sum, m) => sum + m.marks, 0) / marks.length).toFixed(
              2,
            )
          : 0;

      // Get student's attendance
      const attendance = await Attendance.find({ student: student._id });
      const presentDays = attendance.filter(
        (a) => a.status === "present",
      ).length;
      const attendancePercentage =
        attendance.length > 0
          ? ((presentDays / attendance.length) * 100).toFixed(2)
          : 0;

      return res.status(200).json({
        studentName: student.name,
        rollNumber: student.rollNumber,
        className: student.className,
        totalSubjects: student.subjects?.length || 0,
        totalMarks: marks.length,
        averageMarks: avgMarks,
        totalAttendance: attendance.length,
        presentDays: presentDays,
        attendancePercentage: attendancePercentage,
      });
    }

    // For teacher/admin, show overall stats
    const totalStudents = await Student.countDocuments();
    const totalSubjects = await Subject.countDocuments();
    const totalMarksEntries = await Mark.countDocuments();

    const avgResult = await Mark.aggregate([
      {
        $group: {
          _id: null,
          overallAverage: { $avg: "$marks" },
        },
      },
    ]);
    const overallAverage =
      avgResult.length > 0 ? avgResult[0].overallAverage.toFixed(2) : 0;

    res.status(200).json({
      totalStudents,
      totalSubjects,
      totalMarksEntries,
      overallAverage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
