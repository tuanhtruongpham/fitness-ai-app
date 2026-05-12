const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/plan", authMiddleware, (req, res) => {
  const workoutPlan = [
    {
      day: "Thứ 2",
      muscle: "Ngực - Vai - Tay sau",
      exercises: [
        {
          name: "Bench Press",
          sets: 4,
          reps: "8-10",
          video:
            "https://www.youtube.com/watch?v=rT7DgCr-3pg",
        },
        {
          name: "Shoulder Press",
          sets: 3,
          reps: "10-12",
          video:
            "https://www.youtube.com/watch?v=qEwKCR5JCog",
        },
      ],
    },

    {
      day: "Thứ 3",
      muscle: "Lưng - Xô - Tay trước",
      exercises: [
        {
          name: "Lat Pulldown",
          sets: 4,
          reps: "10-12",
          video:
            "https://www.youtube.com/watch?v=CAwf7n6Luuc",
        },
      ],
    },

    {
      day: "Thứ 4",
      muscle: "Chân",
      exercises: [
        {
          name: "Squat",
          sets: 4,
          reps: "8-10",
          video:
            "https://www.youtube.com/watch?v=YaXPRqUwItQ",
        },
      ],
    },
  ];

  res.json({
    message: "Lấy lịch tập thành công",
    workoutPlan,
  });
});

module.exports = router;