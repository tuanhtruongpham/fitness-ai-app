import { useState, useEffect } from "react";
import axios from "axios";

function Meal({ onNavigate, onLogout }) {
  const today = new Date().toLocaleDateString();

  const [water, setWater] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("waterData"));

    if (!saved || saved.date !== today) {
      return 0;
    }

    return saved.amount;
  });

  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);

  const [eatenCalories, setEatenCalories] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("eatenCaloriesData"));

    if (!saved || saved.date !== today) {
      return 0;
    }

    return saved.amount;
  });

  const [eatenMeals, setEatenMeals] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("eatenMealsData"));

    if (!saved || saved.date !== today) {
      return [];
    }

    return saved.meals || [];
  });

  const API_URL = "http://localhost:5000/api/meal";

 useEffect(() => {
  generateTodayPlan();
}, []);

  useEffect(() => {
    localStorage.setItem(
      "waterData",
      JSON.stringify({
        date: today,
        amount: water,
      })
    );
  }, [water, today]);

  useEffect(() => {
    localStorage.setItem(
      "eatenCaloriesData",
      JSON.stringify({
        date: today,
        amount: eatenCalories,
      })
    );
  }, [eatenCalories, today]);

  useEffect(() => {
    localStorage.setItem(
      "eatenMealsData",
      JSON.stringify({
        date: today,
        meals: eatenMeals,
      })
    );
  }, [eatenMeals, today]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        authorization: token,
      },
    };
  };

  const generateTodayPlan = async () => {
  try {
    const savedDate = localStorage.getItem("mealPlanDate");
    const todayDate = new Date().toLocaleDateString();

    if (savedDate === todayDate) {
      const res = await axios.get(API_URL, getAuthHeader());

      if (res.data.mealPlans?.length > 0) {
        setCurrentPlan(res.data.mealPlans[0]);
        return;
      }
    }

    const newPlan = await axios.post(
      `${API_URL}/save-today`,
      {},
      getAuthHeader()
    );

    localStorage.setItem("mealPlanDate", todayDate);
    setCurrentPlan(newPlan.data.mealPlan);
  } catch (error) {
    console.log(error);
  }
};

 const generateMealPlan = async () => {
  try {
    const res = await axios.post(
      `${API_URL}/save-today`,
      {},
      getAuthHeader()
    );

    localStorage.setItem("mealPlanDate", new Date().toLocaleDateString());

    setCurrentPlan(res.data.mealPlan);
    setMealPlans((prev) => [res.data.mealPlan, ...prev]);
    setEatenCalories(0);
    setEatenMeals([]);
  } catch (error) {
    console.log(error);
    alert("Hãy cập nhật đầy đủ Profile trước khi tạo meal plan");
  }
};

  const getMealKey = (meal) => {
    return meal._id || meal.label || meal.time;
  };

  const toggleMealEaten = (meal) => {
    const mealKey = getMealKey(meal);
    const calories = Number(meal.targetCalories) || 0;
    const isEaten = eatenMeals.includes(mealKey);

    let updatedMeals;
    let updatedCalories;

    if (isEaten) {
      updatedMeals = eatenMeals.filter((m) => m !== mealKey);
      updatedCalories = Math.max(eatenCalories - calories, 0);
    } else {
      updatedMeals = [...eatenMeals, mealKey];
      updatedCalories = eatenCalories + calories;
    }

    setEatenMeals(updatedMeals);
    setEatenCalories(updatedCalories);
  };

  const dailyTarget = currentPlan?.dailyTarget;

  const caloriePercent = dailyTarget?.calories
    ? Math.min((eatenCalories / dailyTarget.calories) * 100, 100)
    : 0;

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

            <div style={styles.menuItem} onClick={() => onNavigate("ai-coach")}>
              🤖 AI Coach
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("profile")}>
              👤 Profile
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
              Gợi ý bữa ăn cá nhân hóa theo cân nặng, target weight, BMI và mục tiêu.
            </p>
          </div>

          <div style={styles.profile}>🔔 👤</div>
        </div>

        {!currentPlan ? (
          <div style={styles.emptyBox}>
            <h2>Chưa có meal plan</h2>
            <p style={styles.cardText}>
              User này chưa có meal plan. Bấm nút dưới để tạo meal plan theo profile.
            </p>

            <button style={styles.detailBtn} onClick={generateMealPlan}>
              Generate Meal Plan
            </button>
          </div>
        ) : (
          <>
            <div style={styles.topGrid}>
              <div style={styles.calorieCard}>
                <div>
                  <h3>🔥 Hôm nay đã ăn</h3>
                  <h1>
                    {eatenCalories} / {dailyTarget?.calories || 0} kcal
                  </h1>
                  <p style={styles.cardText}>
                    {Math.round(caloriePercent)}% daily target
                  </p>
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
                <h1>{dailyTarget?.proteinG || 0}g</h1>
                <p style={styles.cardText}>Hỗ trợ phục hồi và tăng cơ</p>
              </div>

              <div style={styles.macroCard}>
                <h3>🍚 Carbs</h3>
                <h1>{dailyTarget?.carbsG || 0}g</h1>
                <p style={styles.cardText}>Năng lượng tập luyện</p>
              </div>

              <div style={styles.macroCard}>
                <h3>🥑 Fat</h3>
                <h1>{dailyTarget?.fatG || 0}g</h1>
                <p style={styles.cardText}>Chất béo tốt cần thiết</p>
              </div>
            </div>

            <div style={styles.middleGrid}>
              <div style={styles.goalBox}>
                <h2 style={styles.sectionTitle}>🎯 Mục tiêu dinh dưỡng</h2>

                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span>Goal</span>
                    <strong>{currentPlan.goalLabel || currentPlan.goal}</strong>
                  </div>

                  <div style={styles.infoItem}>
                    <span>Current Weight</span>
                    <strong>{currentPlan.currentWeight || "-"} kg</strong>
                  </div>

                  <div style={styles.infoItem}>
                    <span>Target Weight</span>
                    <strong>{currentPlan.targetWeight || "-"} kg</strong>
                  </div>

                  <div style={styles.infoItem}>
                    <span>BMI</span>
                    <strong>
                      {currentPlan.bmi || "-"} / {currentPlan.bmiCategory || "-"}
                    </strong>
                  </div>
                </div>

                <button style={styles.detailBtn} onClick={generateMealPlan}>
                  Generate New Plan
                </button>

                {mealPlans.length > 0 && (
                  <div style={styles.goalButtons}>
                    {mealPlans.map((plan, index) => (
                      <button
                        key={plan._id || index}
                        style={
                          currentPlan._id === plan._id
                            ? styles.activeGoalBtn
                            : styles.goalBtn
                        }
                        onClick={() => {
                          setCurrentPlan(plan);
                          setEatenCalories(0);
                          setEatenMeals([]);
                        }}
                      >
                        Plan {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={styles.waterBox}>
                <h2 style={styles.sectionTitle}>💧 Water Intake</h2>
                <h1 style={styles.waterNumber}>{water} / 8 glasses</h1>

                <div style={styles.waterDots}>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      style={index < water ? styles.activeWaterDot : styles.waterDot}
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
                <h2 style={styles.sectionTitle}>📅 Gợi ý bữa ăn hôm nay</h2>

                <div style={styles.mealGrid}>
                  {currentPlan.meals?.map((meal) => {
                    const mealKey = getMealKey(meal);
                    const isEaten = eatenMeals.includes(mealKey);

                    return (
                      <div key={mealKey} style={styles.mealCard}>
                        <div style={styles.mealHeader}>
                          <div>
                            <h2>🍽 {meal.label || meal.time}</h2>
                            <p style={styles.cardText}>
                              Target: {meal.targetCalories} kcal •{" "}
                              {meal.targetProteinG}g protein •{" "}
                              {meal.targetCarbsG}g carbs • {meal.targetFatG}g fat
                            </p>
                          </div>

                          <div style={styles.mealActions}>
                            <button
                              style={isEaten ? styles.eatenBtn : styles.detailBtn}
                              onClick={() => toggleMealEaten(meal)}
                            >
                              {isEaten ? "✓ Eaten" : "Mark Eaten"}
                            </button>

                            <button
                              style={styles.detailBtn}
                              onClick={() => setSelectedMeal(meal)}
                            >
                              View
                            </button>
                          </div>
                        </div>

                        <div style={styles.foodList}>
                          {meal.items?.map((item) => (
                            <div key={item._id || item.id} style={styles.foodItem}>
                              <strong>{item.name}</strong>
                              <p style={styles.cardText}>
                                {item.quantity} • {item.grams}g
                              </p>

                              <div style={styles.miniMacroGrid}>
                                <span>🔥 {item.calories} kcal</span>
                                <span>💪 {item.proteinG}g</span>
                                <span>🍚 {item.carbsG}g</span>
                                <span>🥑 {item.fatG}g</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={styles.aiBox}>
                <h2 style={styles.aiTitle}>🤖 AI Nutrition Tips</h2>

                <p style={styles.aiText}>Dựa trên profile hiện tại của bạn:</p>

                <ul style={styles.tipList}>
                  <li>Goal: {currentPlan.goalLabel || currentPlan.goal}</li>
                  <li>Calories: {dailyTarget?.calories || 0} kcal</li>
                  <li>Protein: {dailyTarget?.proteinG || 0}g</li>
                  <li>Carbs: {dailyTarget?.carbsG || 0}g</li>
                  <li>Fat: {dailyTarget?.fatG || 0}g</li>
                  <li>BMI: {currentPlan.bmi || "-"}</li>
                  <li>Target Weight: {currentPlan.targetWeight || "-"} kg</li>
                </ul>

                <p style={styles.aiText}>
                  Meal plan sẽ thay đổi theo mục tiêu, cân nặng hiện tại và cân nặng mong muốn.
                </p>

                <div
                  style={styles.aiCircle}
                  onClick={() => onNavigate("ai-coach")}
                >
                  AI
                </div>
              </div>
            </div>
          </>
        )}

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
                🍽 {selectedMeal.label || selectedMeal.time}
              </h2>

              <p style={styles.cardText}>
                Target: {selectedMeal.targetCalories} kcal •{" "}
                {selectedMeal.targetProteinG}g protein •{" "}
                {selectedMeal.targetCarbsG}g carbs • {selectedMeal.targetFatG}g fat
              </p>

              <div style={styles.modalEatBox}>
                <button
                  style={
                    eatenMeals.includes(getMealKey(selectedMeal))
                      ? styles.eatenBtn
                      : styles.detailBtn
                  }
                  onClick={() => toggleMealEaten(selectedMeal)}
                >
                  {eatenMeals.includes(getMealKey(selectedMeal))
                    ? "✓ Đã ăn"
                    : "Tick đã ăn"}
                </button>

                <span style={styles.cardText}>
                  +{selectedMeal.targetCalories || 0} kcal vào hôm nay
                </span>
              </div>

              <div style={styles.foodImageBox}>Meal image will be added later</div>

              <h3 style={styles.sectionTitle}>Chi tiết món ăn</h3>

              {selectedMeal.items?.map((item) => (
                <div key={item._id || item.id} style={styles.detailFoodBox}>
                  <h3>{item.name}</h3>

                  <p>🍽 Khẩu phần: {item.quantity}</p>
                  <p>⚖️ Khối lượng: {item.grams}g</p>

                  <div style={styles.detailMacroGrid}>
                    <div>🔥 Calories: {item.calories} kcal</div>
                    <div>💪 Protein: {item.proteinG}g</div>
                    <div>🍚 Carbs: {item.carbsG}g</div>
                    <div>🥑 Fat: {item.fatG}g</div>
                    <div>🌾 Fiber: {item.fiberG}g</div>
                    <div>🍬 Sugar: {item.sugarG}g</div>
                    <div>🧂 Sodium: {item.sodiumMg}mg</div>
                  </div>

                  <h4>🧾 Nguyên liệu</h4>

                  <ul style={styles.tipList}>
                    {item.ingredients?.map((ing) => (
                      <li key={ing}>{ing}</li>
                    ))}
                  </ul>

                  <p style={styles.reasonText}>🤖 {item.reason}</p>
                </div>
              ))}
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

  position: "fixed",
  left: 0,
  top: 0,
  height: "100vh",
  boxSizing: "border-box",
  zIndex: 1000,
},

  logo: { fontSize: "30px", marginBottom: "40px" },
  green: { color: "#84cc16" },

  menu: { display: "flex", flexDirection: "column", gap: "16px" },

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
  marginBottom: "80px",
},

  main: {
  flex: 1,
  padding: "40px",
  marginLeft: "320px",
  width: "calc(100% - 320px)",
  boxSizing: "border-box",
},

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
  },

  title: { margin: 0, fontSize: "38px" },
  subtitle: { color: "#94a3b8", marginTop: "10px" },
  profile: { fontSize: "28px" },

  emptyBox: {
    background: "#111827",
    padding: "40px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
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

  cardText: { color: "#94a3b8", lineHeight: "1.6" },

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

  sectionTitle: { color: "#84cc16", marginBottom: "20px" },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "20px",
  },

  infoItem: {
    background: "#0f172a",
    padding: "16px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    border: "1px solid #1f2937",
  },

  goalButtons: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginTop: "20px",
  },

  goalBtn: {
    padding: "12px 18px",
    borderRadius: "14px",
    border: "none",
    background: "#1f2937",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  activeGoalBtn: {
    padding: "12px 18px",
    borderRadius: "14px",
    border: "none",
    background: "#84cc16",
    color: "#0f172a",
    fontWeight: "bold",
    cursor: "pointer",
  },

  waterNumber: { margin: "0 0 18px" },

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

  waterActions: { display: "flex", gap: "12px" },

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

  mealActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  foodList: {
    marginTop: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    color: "#cbd5e1",
  },

  foodItem: {
    padding: "14px",
    borderRadius: "14px",
    background: "#111827",
    border: "1px solid #1f2937",
  },

  miniMacroGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginTop: "10px",
    color: "#cbd5e1",
    fontSize: "14px",
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

  eatenBtn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "12px",
    background: "#22c55e",
    color: "white",
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

  aiTitle: { color: "#84cc16" },
  aiText: { color: "#cbd5e1", lineHeight: "1.7" },
  tipList: { color: "#cbd5e1", lineHeight: "2" },

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
    cursor: "pointer",
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
    width: "700px",
    maxHeight: "88vh",
    overflowY: "auto",
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

  modalTitle: { color: "#84cc16", marginBottom: "20px" },

  modalEatBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    margin: "18px 0",
    flexWrap: "wrap",
  },

  foodImageBox: {
    height: "220px",
    background: "#1f2937",
    borderRadius: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#94a3b8",
    marginBottom: "20px",
  },

  detailFoodBox: {
    background: "#0f172a",
    padding: "20px",
    borderRadius: "18px",
    marginBottom: "18px",
    border: "1px solid #1f2937",
  },

  detailMacroGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "16px",
    marginBottom: "16px",
    color: "#cbd5e1",
  },

  reasonText: {
    marginTop: "12px",
    color: "#84cc16",
    lineHeight: "1.6",
  },
};

export default Meal;