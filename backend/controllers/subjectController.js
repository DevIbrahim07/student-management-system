const Subject = require("../models/Subject");

// create subject

const createSubject = async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({
      message: "Error creating subject",
      error: error.message,
    });
  }
};

// get all subjects

const getSubjects = async (req, res) => {
  try {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalSubjects = await Subject.countDocuments();

    const subjects = await Subject.find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      subjects,
      totalSubjects,
      totalPages: Math.ceil(totalSubjects / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching subjects",
      error: error.message,
    });
  }
};

module.exports = {
  createSubject,
  getSubjects,
};
