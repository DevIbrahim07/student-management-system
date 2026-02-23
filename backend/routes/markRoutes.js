const express = require("express");
const {
  addMark,
  getStudentMarks,
  getStudentAverage,
} = require("../controllers/markController.js");
const { protect } = require("../middleware/authMiddleware.js");
const authorizeRoles = require("../middleware/roleMiddleware.js");

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "teacher"), addMark);
router.get("/average/:studentId", protect, getStudentAverage);
router.get("/", protect, getStudentMarks);

module.exports = router;
