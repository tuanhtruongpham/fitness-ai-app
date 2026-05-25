const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/test", (req, res) => {
  res.json({ message: "Notification route OK" });
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
});

router.put("/read", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id },
      { isRead: true }
    );

    res.json({
      message: "Notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notifications",
    });
  }
});

module.exports = router;