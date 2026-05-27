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

// =========================
// CORS FIX
// =========================
const corsOptions = {
  origin: [
    "https://fitnessapput.site",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "authorization",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("/*splat", cors(corsOptions));


app.use(express.json());

// =========================
// ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/meal", mealRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

// =========================
// TEST ROUTE
// =========================
app.get("/api/notifications-test", (req, res) => {
  res.json({ message: "Server test OK" });
});

// =========================
// STATIC FILES
// =========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================
// ROOT
// =========================
app.get("/", (req, res) => {
  res.send("Fitness AI API Running");
});

// =========================
// EMAIL TEST
// =========================
const sendEmail = require("./utils/emailService");

app.get("/api/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: "trandu101073@gmail.com",
      subject: "Fitness AI Test",
      html: "<h1>Email API Works ✅</h1>",
    });

    console.log("✅ TEST EMAIL SENT");

    res.json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("❌ TEST EMAIL ERROR:", error.message);

    res.status(500).json({
      error: error.message,
    });
  }
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});