const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const markRoutes = require("./routes/markRoutes");
const dashboardRoutes = require("./routes/dashBoardRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

dotenv.config();
connectDB();

const app = express();

// middleware

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

// auth routes
app.use("/api/auth", authRoutes);
// student routes
app.use("/api/students", studentRoutes);
// subject routes
app.use("/api/subjects", subjectRoutes);
// mark router
app.use("/api/marks", markRoutes);
// dashboard router
app.use("/api/dashboard", dashboardRoutes);
// attendance router
app.use("/api/attendance", attendanceRoutes);
// analytics router
app.use("/api/analytics", analyticsRoutes);
// test route
app.get("/", (req, res) => {
  res.send("student management api is runnig");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
