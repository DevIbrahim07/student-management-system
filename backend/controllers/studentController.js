const Student = require("../models/Student");
const Subject = require("../models/Subject");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/////////////// create a student///////////

const createStudent = async (req, res) => {
  try {
    const { name, email, phone, rollNumber, className, age, address } =
      req.body;

    // Check if user already exists with this email
    let user = await User.findOne({ email });

    // If user doesn't exist, create one with default password
    if (!user) {
      // Generate a simple default password (Student can change later)
      const defaultPassword = "Student@123";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      user = new User({
        name,
        email,
        password: hashedPassword,
        role: "student",
      });
      await user.save();
    }

    // Create student with reference to user
    const student = new Student({
      name,
      email,
      phone,
      rollNumber,
      className,
      age,
      address,
      user: user._id, // Link to User model
    });

    // save to database
    await student.save();

    res.status(201).json({
      success: true,
      message:
        "Student created successfully. Email: " +
        email +
        ", Default Password: Student@123",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create student",
      error: error.message,
    });
  }
};

/////////////// get all students///////////
// pagination/ search/filter by classname /sorting

const getStudents = async (req, res) => {
  try {
    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // search
    const search = req.query.search || "";

    // filter
    const className = req.query.className;

    // sorting
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "desc" ? 1 : -1;

    // build query object
    const query = {};
    if (req.user.role === "student") {
      query.user = req.user._id; // Only return the student's own record
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (className) {
      query.className = className;
    }

    const totalStudents = await Student.countDocuments(query);

    const students = await Student.find(query)
      .populate("subjects", "name code")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      succes: true,
      totalStudents,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const getStudents = async (req, res) => {
//   try {
//     const students = await Student.find().sort({
//       createdAt: -1,
//     });
//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

//////////////////get single student ////////////////////

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("subjects");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // If student trying to access, ensure they can only see their own record
    if (
      req.user.role === "student" &&
      student.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only access your own student record",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

///////////////////// update student ////////////////////

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//////////////////// delete student /////////////////////

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    res.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Assign Subjects to Student
const assignSubjects = async (req, res) => {
  try {
    const { subjects } = req.body; // array of subject IDs

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Optional: validate subject IDs exist
    const validSubjects = await Subject.find({
      _id: { $in: subjects },
    });

    if (validSubjects.length !== subjects.length) {
      return res.status(400).json({ message: "One or more subjects invalid" });
    }

    student.subjects = subjects;

    await student.save();

    res.status(200).json({
      message: "Subjects assigned successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  assignSubjects,
};
