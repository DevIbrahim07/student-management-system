const express = require("express");
const {
  markAttnedance,
  getStudentAttendance,
  getAttendanceByDate,
  getAttendanceSummary,
} = require("../controllers/attendanceController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "teacher"), markAttnedance);
router.get("/student/:studentId", protect, getStudentAttendance);
router.get(
  "/date/:date",
  protect,
  authorizeRoles("admin", "teacher"),
  getAttendanceByDate,
);
router.get("/summary/:studentId", protect, getAttendanceSummary);

module.exports = router;
