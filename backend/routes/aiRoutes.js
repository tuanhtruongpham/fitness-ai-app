const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.post("/generate-workout", authMiddleware, async (req, res) => {
  try {
    const { goal, level, daysPerWeek } = req.body;

    let workoutPlan = [];

    if (goal === "Tăng cơ") {
      if (daysPerWeek === 3) {
        workoutPlan = [
          {
            day: "Thứ 2",
            muscle: "Ngực - Vai - Tay sau",
          },
          {
            day: "Thứ 4",
            muscle: "Lưng - Tay trước",
          },
          {
            day: "Thứ 6",
            muscle: "Chân",
          },
        ];
      }

      if (daysPerWeek === 5) {
        workoutPlan = [
          {
            day: "Thứ 2",
            muscle: "Ngực",
          },
          {
            day: "Thứ 3",
            muscle: "Lưng",
          },
          {
            day: "Thứ 4",
            muscle: "Vai",
          },
          {
            day: "Thứ 5",
            muscle: "Tay",
          },
          {
            day: "Thứ 6",
            muscle: "Chân",
          },
        ];
      }
    }

    res.json({
      message: "AI tạo lịch tập thành công",
      input: {
        goal,
        level,
        daysPerWeek,
      },
      workoutPlan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
});

module.exports = router;