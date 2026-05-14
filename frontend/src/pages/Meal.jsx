import { useState } from "react";

function Meal({ onNavigate, onLogout }) {
  const [selectedGoal, setSelectedGoal] = useState("Fat Loss");
  const [water, setWater] = useState(5);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const mealPlans = {
    "Fat Loss": {
      calories: 2200,
      eaten: 1680,
      protein: 150,
      carbs: 210,
      fat: 55,
      meals: [
        {
          type: "Breakfast",
          icon: "🍳",
          calories: 420,
          protein: 32,
          foods: ["3 boiled eggs", "Oatmeal", "Banana"],
          description:
            "Bữa sáng giàu protein, vừa đủ carb để có năng lượng nhưng vẫn hỗ trợ giảm mỡ.",
        },
        {
          type: "Lunch",
          icon: "🍗",
          calories: 620,
          protein: 45,
          foods: ["150g chicken breast", "Brown rice", "Broccoli"],
          description:
            "Bữa trưa cân bằng giữa protein, carb tốt và rau xanh.",
        },
        {
          type: "Snack",
          icon: "🥛",
          calories: 240,
          protein: 25,
          foods: ["Greek yogurt", "Almonds"],
          description:
            "Bữa phụ giúp no lâu và giữ protein cao trong ngày.",
        },
        {
          type: "Dinner",
          icon: "🐟",
          calories: 400,
          protein: 38,
          foods: ["Salmon", "Sweet potato", "Salad"],
          description:
            "Bữa tối nhẹ, giàu chất béo tốt và hỗ trợ phục hồi cơ.",
        },
      ],
      tips: [
        "Ưu tiên protein cao trong mỗi bữa.",
        "Hạn chế nước ngọt và đồ chiên.",
        "Giữ calories thấp hơn TDEE khoảng 300-500 kcal.",
      ],
    },

    Maintain: {
      calories: 2600,
      eaten: 1960,
      protein: 135,
      carbs: 300,
      fat: 70,
      meals: [
        {
          type: "Breakfast",
          icon: "🥪",
          calories: 520,
          protein: 30,
          foods: ["Whole wheat sandwich", "Eggs", "Milk"],
          description:
            "Bữa sáng cân bằng giúp duy trì năng lượng ổn định.",
        },
        {
          type: "Lunch",
          icon: "🍚",
          calories: 720,
          protein: 42,
          foods: ["Rice", "Beef", "Vegetables"],
          description:
            "Bữa trưa đầy đủ carb, protein và chất xơ.",
        },
        {
          type: "Snack",
          icon: "🍌",
          calories: 260,
          protein: 15,
          foods: ["Banana", "Peanut butter", "Protein milk"],
          description:
            "Bữa phụ phù hợp trước hoặc sau tập.",
        },
        {
          type: "Dinner",
          icon: "🍲",
          calories: 460,
          protein: 35,
          foods: ["Chicken soup", "Potatoes", "Vegetables"],
          description:
            "Bữa tối dễ tiêu, đủ chất và không quá nặng bụng.",
        },
      ],
      tips: [
        "Ăn đủ calories để giữ cân.",
        "Duy trì lượng protein ổn định.",
        "Uống nước đều trong ngày.",
      ],
    },

    "Lean Bulk": {
      calories: 3100,
      eaten: 2350,
      protein: 180,
      carbs: 390,
      fat: 85,
      meals: [
        {
          type: "Breakfast",
          icon: "🥞",
          calories: 720,
          protein: 42,
          foods: ["Oatmeal", "4 eggs", "Banana", "Milk"],
          description:
            "Bữa sáng nhiều calories sạch để hỗ trợ tăng cơ.",
        },
        {
          type: "Lunch",
          icon: "🍛",
          calories: 880,
          protein: 55,
          foods: ["300g rice", "200g chicken", "Vegetables"],
          description:
            "Bữa trưa nhiều carb và protein để phục hồi sau tập.",
        },
        {
          type: "Pre-workout",
          icon: "🥤",
          calories: 350,
          protein: 28,
          foods: ["Whey protein", "Bread", "Peanut butter"],
          description:
            "Bữa trước tập giúp tăng năng lượng và hiệu suất.",
        },
        {
          type: "Dinner",
          icon: "🥩",
          calories: 400,
          protein: 50,
          foods: ["Beef", "Potatoes", "Salad"],
          description:
            "Bữa tối giàu protein, hỗ trợ xây cơ và phục hồi.",
        },
      ],
      tips: [
        "Ăn dư calories khoảng 300-500 kcal.",
        "Ưu tiên carb quanh thời điểm tập.",
        "Theo dõi cân nặng mỗi tuần.",
      ],
    },
  };

  const currentPlan = mealPlans[selectedGoal];
  const caloriePercent = Math.min(
    Math.round((currentPlan.eaten / currentPlan.calories) * 100),
    100
  );

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div>
          <h1 style={styles.logo}>
            FITNESS <span style={styles.green}>UT</span>
          </h1>

          <div style={styles.menu}>
            <div style={styles.menuItem} onClick={() => onNavigate("home")}>
              🏠 Dashboard
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("workout")}>
              💪 Workout
            </div>

            <div style={styles.activeMenu} onClick={() => onNavigate("meal")}>
              🍽 Meal Plan
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("progress")}>
              📈 Progress
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("ai")}>
              🤖 AI Coach
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("profile")}>
              👤 Profile
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("settings")}>
              ⚙ Settings
            </div>
          </div>
        </div>

        <div style={styles.logout} onClick={onLogout}>
          🚪 Logout
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Meal Plan 🍽</h1>
            <p style={styles.subtitle}>
              Track calories, macros, water and AI nutrition advice.
            </p>
          </div>

          <div style={styles.profile}>🔔 👤</div>
        </div>

        <div style={styles.topGrid}>
          <div style={styles.calorieCard}>
            <div>
              <h3>🔥 Calories Today</h3>
              <h1>
                {currentPlan.eaten} / {currentPlan.calories}
              </h1>
              <p style={styles.cardText}>{caloriePercent}% of daily target</p>
            </div>

            <div style={styles.progressBg}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${caloriePercent}%`,
                }}
              ></div>
            </div>
          </div>

          <div style={styles.macroCard}>
            <h3>💪 Protein</h3>
            <h1>{currentPlan.protein}g</h1>
            <p style={styles.cardText}>Muscle recovery</p>
          </div>

          <div style={styles.macroCard}>
            <h3>🍚 Carbs</h3>
            <h1>{currentPlan.carbs}g</h1>
            <p style={styles.cardText}>Training energy</p>
          </div>

          <div style={styles.macroCard}>
            <h3>🥑 Fat</h3>
            <h1>{currentPlan.fat}g</h1>
            <p style={styles.cardText}>Hormone support</p>
          </div>
        </div>

        <div style={styles.middleGrid}>
          <div style={styles.goalBox}>
            <h2 style={styles.sectionTitle}>🎯 Nutrition Goal</h2>

            <div style={styles.goalButtons}>
              {Object.keys(mealPlans).map((goal) => (
                <button
                  key={goal}
                  style={
                    selectedGoal === goal
                      ? styles.activeGoalBtn
                      : styles.goalBtn
                  }
                  onClick={() => setSelectedGoal(goal)}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.waterBox}>
            <h2 style={styles.sectionTitle}>💧 Water Intake</h2>

            <h1 style={styles.waterNumber}>{water} / 8 glasses</h1>

            <div style={styles.waterDots}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  style={
                    index < water
                      ? styles.activeWaterDot
                      : styles.waterDot
                  }
                ></div>
              ))}
            </div>

            <div style={styles.waterActions}>
              <button
                style={styles.smallBtn}
                onClick={() => setWater(Math.max(water - 1, 0))}
              >
                -
              </button>

              <button
                style={styles.smallBtn}
                onClick={() => setWater(Math.min(water + 1, 8))}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div style={styles.contentGrid}>
          <div style={styles.mealSection}>
            <h2 style={styles.sectionTitle}>📅 Today's Meal Schedule</h2>

            <div style={styles.mealGrid}>
              {currentPlan.meals.map((meal) => (
                <div key={meal.type} style={styles.mealCard}>
                  <div style={styles.mealHeader}>
                    <div>
                      <h2>
                        {meal.icon} {meal.type}
                      </h2>

                      <p style={styles.cardText}>
                        {meal.calories} cal • {meal.protein}g protein
                      </p>
                    </div>

                    <button
                      style={styles.detailBtn}
                      onClick={() => setSelectedMeal(meal)}
                    >
                      View
                    </button>
                  </div>

                  <div style={styles.foodList}>
                    {meal.foods.map((food) => (
                      <div key={food} style={styles.foodItem}>
                        <span>• {food}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.aiBox}>
            <h2 style={styles.aiTitle}>🤖 AI Nutrition Tips</h2>

            <p style={styles.aiText}>
              Based on your current goal, today you should focus on:
            </p>

            <ul style={styles.tipList}>
              {currentPlan.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>

            <div style={styles.aiCircle}>AI</div>
          </div>
        </div>

        {selectedMeal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalBox}>
              <button
                style={styles.closeBtn}
                onClick={() => setSelectedMeal(null)}
              >
                ✕
              </button>

              <h2 style={styles.modalTitle}>
                {selectedMeal.icon} {selectedMeal.type}
              </h2>

              <div style={styles.foodImageBox}>Meal image will be added later</div>

              <div style={styles.infoGrid}>
                <p>
                  <b>Calories:</b> {selectedMeal.calories} cal
                </p>
                <p>
                  <b>Protein:</b> {selectedMeal.protein}g
                </p>
              </div>

              <p style={styles.modalDesc}>{selectedMeal.description}</p>

              <h3 style={styles.sectionTitle}>Foods</h3>

              <ul style={styles.tipList}>
                {selectedMeal.foods.map((food) => (
                  <li key={food}>{food}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "260px",
    background: "#111827",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: "1px solid #1f2937",
  },

  logo: {
    fontSize: "30px",
    marginBottom: "40px",
  },

  green: {
    color: "#84cc16",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  menuItem: {
    padding: "16px",
    borderRadius: "14px",
    background: "#1f2937",
    cursor: "pointer",
  },

  activeMenu: {
    padding: "16px",
    borderRadius: "14px",
    background: "linear-gradient(90deg,#84cc16,#65a30d)",
    color: "#0f172a",
    fontWeight: "bold",
    cursor: "pointer",
  },

  logout: {
    padding: "16px",
    borderRadius: "14px",
    background: "#1f2937",
    textAlign: "center",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "40px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
  },

  title: {
    margin: 0,
    fontSize: "38px",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: "10px",
  },

  profile: {
    fontSize: "28px",
  },

  topGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: "20px",
    marginBottom: "25px",
  },

  calorieCard: {
    background: "#111827",
    padding: "25px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
  },

  macroCard: {
    background: "#111827",
    padding: "25px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
  },

  cardText: {
    color: "#94a3b8",
  },

  progressBg: {
    width: "100%",
    height: "12px",
    background: "#1f2937",
    borderRadius: "999px",
    marginTop: "24px",
  },

  progressFill: {
    height: "100%",
    background: "#84cc16",
    borderRadius: "999px",
  },

  middleGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "25px",
    marginBottom: "25px",
  },

  goalBox: {
    background: "#111827",
    padding: "28px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
  },

  waterBox: {
    background: "#111827",
    padding: "28px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
  },

  sectionTitle: {
    color: "#84cc16",
    marginBottom: "20px",
  },

  goalButtons: {
    display: "flex",
    gap: "15px",
  },

  goalBtn: {
    padding: "16px 22px",
    borderRadius: "16px",
    border: "none",
    background: "#1f2937",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  activeGoalBtn: {
    padding: "16px 22px",
    borderRadius: "16px",
    border: "none",
    background: "#84cc16",
    color: "#0f172a",
    fontWeight: "bold",
    cursor: "pointer",
  },

  waterNumber: {
    margin: "0 0 18px",
  },

  waterDots: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    gap: "8px",
    marginBottom: "20px",
  },

  waterDot: {
    height: "18px",
    borderRadius: "999px",
    background: "#1f2937",
  },

  activeWaterDot: {
    height: "18px",
    borderRadius: "999px",
    background: "#84cc16",
  },

  waterActions: {
    display: "flex",
    gap: "12px",
  },

  smallBtn: {
    width: "48px",
    height: "40px",
    borderRadius: "12px",
    border: "none",
    background: "#84cc16",
    color: "#0f172a",
    fontSize: "22px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 0.8fr",
    gap: "25px",
  },

  mealSection: {
    background: "#111827",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
  },

  mealGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  mealCard: {
    background: "#0f172a",
    padding: "22px",
    borderRadius: "20px",
    border: "1px solid #1f2937",
  },

  mealHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "start",
  },

  foodList: {
    marginTop: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    color: "#cbd5e1",
  },

  foodItem: {
    paddingBottom: "8px",
    borderBottom: "1px solid #1f2937",
  },

  detailBtn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "12px",
    background: "#84cc16",
    color: "#0f172a",
    fontWeight: "bold",
    cursor: "pointer",
  },

  aiBox: {
    background: "linear-gradient(180deg,#111827,#1e293b)",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.3)",
    position: "relative",
    overflow: "hidden",
  },

  aiTitle: {
    color: "#84cc16",
  },

  aiText: {
    color: "#cbd5e1",
    lineHeight: "1.7",
  },

  tipList: {
    color: "#cbd5e1",
    lineHeight: "2",
  },

  aiCircle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "#84cc16",
    color: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "34px",
    fontWeight: "bold",
    marginTop: "40px",
    boxShadow: "0 0 40px rgba(132,204,22,0.5)",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modalBox: {
    width: "620px",
    background: "#111827",
    borderRadius: "24px",
    padding: "30px",
    border: "1px solid rgba(132,204,22,0.4)",
    position: "relative",
  },

  closeBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    border: "none",
    background: "#1f2937",
    color: "white",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "18px",
  },

  modalTitle: {
    color: "#84cc16",
    marginBottom: "20px",
  },

  foodImageBox: {
    height: "260px",
    background: "#1f2937",
    borderRadius: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#94a3b8",
    marginBottom: "20px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    color: "#cbd5e1",
  },

  modalDesc: {
    color: "#cbd5e1",
    lineHeight: "1.7",
    marginTop: "16px",
  },
};

export default Meal;