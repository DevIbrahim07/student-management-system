const Student = require("../models/Student");
const Mark = require("../models/Mark");
const Attendance = require("../models/Attendence");
const mongoose = require("mongoose");

const getAnalytics = async (req, res) => {
  try {
    // Total Students Count
    const totalStudents = await Student.countDocuments();

    // Student Average Marks
    const studentAverages = await Mark.aggregate([
      {
        $group: {
          _id: "$student",
          averageMarks: { $avg: "$marks" },
        },
      },
      {
        $sort: { averageMarks: -1 },
      },
    ]);

    // Class Average
    const classAverage =
      studentAverages.length > 0
        ? studentAverages.reduce((acc, curr) => acc + curr.averageMarks, 0) /
          studentAverages.length
        : 0;

    // Top Performers (Top 5)
    const toppers = await Promise.all(
      studentAverages.slice(0, 5).map(async (data) => {
        const student = await Student.findById(data._id);
        return {
          name: student?.name || "Unknown",
          averageMarks: data.averageMarks,
        };
      }),
    );

    // Weak Students (< 40%)
    const weakStudentsData = studentAverages.filter((s) => s.averageMarks < 40);
    const weakStudents = await Promise.all(
      weakStudentsData.map(async (ws) => {
        const student = await Student.findById(ws._id);
        return {
          name: student?.name || "Unknown",
          averageMarks: ws.averageMarks,
        };
      }),
    );

    // Average by Subject
    const averagesBySubject = await Mark.aggregate([
      {
        $group: {
          _id: "$subject",
          average: { $avg: "$marks" },
        },
      },
      {
        $lookup: {
          from: "subjects",
          localField: "_id",
          foreignField: "_id",
          as: "subjectInfo",
        },
      },
      {
        $unwind: "$subjectInfo",
      },
      {
        $project: {
          subject: "$subjectInfo.name",
          average: 1,
        },
      },
    ]);

    // Low Attendance (< 75%)
    const attendanceData = await Attendance.aggregate([
      {
        $group: {
          _id: "$student",
          totalClasses: { $sum: 1 },
          presentCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          attendancePercentage: {
            $multiply: [{ $divide: ["$presentCount", "$totalClasses"] }, 100],
          },
        },
      },
      {
        $match: { attendancePercentage: { $lt: 75 } },
      },
    ]);

    const lowAttendance = await Promise.all(
      attendanceData.map(async (a) => {
        const student = await Student.findById(a._id);
        return {
          name: student?.name || "Unknown",
          attendancePercentage: a.attendancePercentage,
        };
      }),
    );

    res.json({
      totalStudents,
      classAverage,
      toppers,
      weakStudents,
      averagesBySubject,
      lowAttendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
