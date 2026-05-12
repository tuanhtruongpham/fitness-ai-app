const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/plan", authMiddleware, (req, res) => {
  const mealPlan = {
    goal: "Tăng cơ",
    calories: 2500,
    protein: "150g",
    carbs: "300g",
    fat: "70g",
    meals: [
      {
        time: "Bữa sáng",
        foods: ["Yến mạch", "Trứng gà", "Chuối"],
      },
      {
        time: "Bữa trưa",
        foods: ["Cơm trắng", "Ức gà", "Rau xanh"],
      },
      {
        time: "Bữa phụ",
        foods: ["Sữa chua", "Khoai lang"],
      },
      {
        time: "Bữa tối",
        foods: ["Cơm", "Cá hồi", "Salad"],
      },
    ],
  };

  res.json({
    message: "Lấy thực đơn thành công",
    mealPlan,
  });
});

module.exports = router;