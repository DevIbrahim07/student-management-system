const express = require("express");
const {
  createSubject,
  getSubjects,
} = require("../controllers/subjectController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getSubjects);
router.post("/", protect, authorizeRoles("admin"), createSubject);

module.exports = router;
