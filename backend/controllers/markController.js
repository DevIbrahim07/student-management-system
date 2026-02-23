const Mark = require("../models/Mark");
const Student = require("../models/Student");
const mongoose = require("mongoose");

////////////////add mark ////////////////////////
const addMark = async (req, res) => {
  try {
    const { student, subject, marks, examType } = req.body;

    const newMark = new Mark({
      student,
      subject,
      marks,
      examType,
    });

    console.log("New Mark Object:", newMark);
    await newMark.save();
    console.log("Mark saved successfully:", newMark);
    res.status(200).json(newMark);
  } catch (error) {
    res.status(500).json({
      message: "Error adding mark",
      error: error.message,
    });
  }
};

///////////get marks of students /////////////////

const getStudentMarks = async (req, res) => {
  try {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.user.role === "student") {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) {
        return res.status(404).json({ message: "Student record not found" });
      }
      query.student = student._id;
    } else {
      // Admin/Teacher can filter by student ID from query params
      const { studentId } = req.query;
      if (studentId && studentId !== "") {
        query.student = studentId;
      }
    }

    const totalMarks = await Mark.countDocuments(query);

    const marks = await Mark.find(query)
      .populate("student", "name rollNumber")
      .populate("subject", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      marks,
      totalMarks,
      totalPages: Math.ceil(totalMarks / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/////// get student average marks ////////////

const getStudentAverage = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const result = await Mark.aggregate([
      {
        $match: {
          student: new mongoose.Types.ObjectId(studentId),
        },
      },
      {
        $group: {
          _id: "$student",
          averageMarks: { $avg: "$marks" },
          totalMarksEntries: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({
        message: "No marks found for this student",
      });
    }
    res.status(200).json({
      studentId,
      average: result[0].averageMarks.toFixed(2),
      totalSubjects: result[0].totalMarksEntries,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addMark,
  getStudentMarks,
  getStudentAverage,
};
