const express = require("express");

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  assignSubjects,
} = require("../controllers/studentController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// view (teacher + admin + students can see own data)

router.get("/", protect, getStudents);
router.get("/:id", protect, getStudentById);

// only admin/teacher can modify

router.post("/", protect, authorizeRoles("admin", "teacher"), createStudent);
router.put("/:id", protect, authorizeRoles("admin"), updateStudent);
router.delete("/:id", protect, authorizeRoles("admin"), deleteStudent);
router.put(
  "/:id/assign-subjects",
  protect,
  authorizeRoles("admin"),
  assignSubjects,
);

module.exports = router;
