
require("dns").setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const aiRoutes = require("./routes/aiRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const progressRoutes = require("./routes/progressRoutes");
const mealRoutes = require("./routes/mealRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const profileRoutes = require("./routes/profileRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/meal", mealRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.get("/api/notifications-test", (req, res) => {
  res.json({ message: "Server test OK" });
});
app.use("/api/notifications", notificationRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Fitness AI API Running");
});

require("./utils/notificationCron");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});