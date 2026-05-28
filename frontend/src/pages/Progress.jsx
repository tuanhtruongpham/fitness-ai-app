import { useState, useEffect } from "react";
import axios from "axios";

function Progress({ onNavigate, onLogout }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [progressData, setProgressData] = useState([]);
  const [user, setUser] = useState(null);
  const [weightInput, setWeightInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [editingWeight, setEditingWeight] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://fitness-ai-app-71hw.onrender.com/api/progress",
        {
          headers: {
            authorization: token,
          },
        }
      );

      console.log("PROGRESS API:", res.data);

      const formatted = res.data.progressList.map((item) => ({
        id: item._id,
        rawDate: item.createdAt,
        date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
        weight: item.weight,
        bmi: item.bmi,
        bodyFat: item.bodyFat || 0,
        note: item.note,
      }));

      setProgressData(formatted);
      setUser(res.data.user);

      if (formatted.length > 0) {
        setSelectedDate(formatted[formatted.length - 1].date);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateWeight = async () => {
    if (!weightInput) {
      alert("Please enter your current weight");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "https://fitness-ai-app-71hw.onrender.com/api/profile/update",
        {
          weight: Number(weightInput),
        },
        {
          headers: {
            authorization: token,
          },
        }
      );

      setWeightInput("");
      setEditingWeight(false);
      fetchProgress();
      alert("Weight updated!");
    } catch (error) {
      console.log(error);
      alert("Update weight failed");
    }
  };

  const handleUpdateGoal = async () => {
    if (!goalInput) {
      alert("Please enter your target weight");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "https://fitness-ai-app-71hw.onrender.com/api/profile/update",
        {
          targetWeight: Number(goalInput),
        },
        {
          headers: {
            authorization: token,
          },
        }
      );

      setGoalInput("");
      setEditingGoal(false);
      fetchProgress();
      alert("Goal updated!");
    } catch (error) {
      console.log(error);
      alert("Update goal failed");
    }
  };

  const latestProgress =
    progressData[progressData.length - 1] || {
      date: "No Data",
      weight: 0,
      bmi: 0,
      bodyFat: 0,
      note: "Chưa có dữ liệu tiến trình",
    };

  const current =
    progressData.find((item) => item.date === selectedDate) || latestProgress;

  const sortedProgress = [...progressData].sort(
    (a, b) => new Date(a.rawDate) - new Date(b.rawDate)
  );

  const firstProgress = sortedProgress[0];
  const lastProgress = sortedProgress[sortedProgress.length - 1];

  const startWeight = Number(firstProgress?.weight) || 0;
  const currentWeight = Number(lastProgress?.weight) || 0;
  const latestWeight = currentWeight;
  const targetWeight = Number(user?.targetWeight) || 0;

  let progress = 0;

  if (
    startWeight &&
    currentWeight &&
    targetWeight &&
    targetWeight !== startWeight
  ) {
    if (targetWeight > startWeight) {
      progress =
        ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100;
    } else {
      progress =
        ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100;
    }
  }

  progress = Number.isFinite(progress)
    ? Math.max(0, Math.min(progress, 100))
    : 0;

  const chartWidth = Math.max(progressData.length * 70, 700);
  const weights = progressData.map((p) => Number(p.weight));
  const minWeight = weights.length > 0 ? Math.min(...weights) : 0;
  const chartMaxWeight = weights.length > 0 ? Math.max(...weights) : 0;
  const range = Math.max(chartMaxWeight - minWeight, 5);

  const chartPoints = progressData.map((item, index) => {
    const x =
      progressData.length === 1
        ? chartWidth / 2
        : 40 + (index / (progressData.length - 1)) * (chartWidth - 80);

    const y = 210 - ((Number(item.weight) - minWeight) / range) * 140;

    return {
      ...item,
      x,
      y,
    };
  });

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div>
          <h1 style={styles.logo}>
            FITNESS <span style={styles.green}>UT</span>
          </h1>

          <div style={styles.menu}>
            <div style={styles.menuItem} onClick={() => onNavigate("home")}>
              Dashboard
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("workout")}>
              Workout
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("meal")}>
              Meal Plan
            </div>

            <div style={styles.activeMenu}>Progress</div>

            <div
              style={styles.menuItem}
              onClick={() => onNavigate("ai-coach")}
            >
              AI Coach
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("profile")}>
              Profile
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
            <h1 style={styles.title}>Progress Tracking 📈</h1>
            <p style={styles.subtitle}>
              Monitor your weight changes by update date.
            </p>
          </div>

          <div style={styles.profile}>🔔</div>
        </div>

        <div style={styles.topGrid}>
          <div style={styles.card}>
            <h3>Current Weight</h3>

            {!editingWeight ? (
              <>
                <h1>{latestProgress.weight} KG</h1>
                <button
                  style={styles.editBtn}
                  onClick={() => {
                    setWeightInput(latestProgress.weight);
                    setEditingWeight(true);
                  }}
                >
                  Edit
                </button>
              </>
            ) : (
              <div style={styles.inlineEdit}>
                <input
                  type="number"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  style={styles.smallInput}
                  autoFocus
                />

                <button style={styles.miniSaveBtn} onClick={handleUpdateWeight}>
                  Save
                </button>

                <button
                  style={styles.cancelBtn}
                  onClick={() => {
                    setEditingWeight(false);
                    setWeightInput("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            <p style={styles.cardText}>Start: {startWeight} KG</p>
          </div>

          <div style={styles.card}>
            <h3>BMI</h3>
            <h1>{latestProgress.bmi}</h1>
            <p style={styles.healthy}>Updated BMI</p>
          </div>

          <div style={styles.card}>
            <h3>Last Update</h3>
            <h1 style={styles.smallTitle}>{latestProgress.date}</h1>
            <p style={styles.cardText}>Latest weight record</p>
          </div>

          <div style={styles.card}>
            <h3>Goal</h3>

            {!editingGoal ? (
              <>
                <h1>{targetWeight} KG</h1>
                <button
                  style={styles.editBtn}
                  onClick={() => {
                    setGoalInput(targetWeight);
                    setEditingGoal(true);
                  }}
                >
                  Edit
                </button>
              </>
            ) : (
              <div style={styles.inlineEdit}>
                <input
                  type="number"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  style={styles.smallInput}
                  autoFocus
                />

                <button style={styles.miniSaveBtn} onClick={handleUpdateGoal}>
                  Save
                </button>

                <button
                  style={styles.cancelBtn}
                  onClick={() => {
                    setEditingGoal(false);
                    setGoalInput("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            <p style={styles.cardText}>Goal Progress</p>
          </div>
        </div>

        <div style={styles.middleGrid}>
          <div style={styles.chartBox}>
            <div style={styles.chartHeader}>
              <h2 style={styles.sectionTitle}>📉 Weight Progress</h2>

              <select
                style={styles.select}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {progressData.length === 0 && <option>No Data</option>}

                {progressData.map((item) => (
                  <option key={item.id} value={item.date}>
                    {item.date} - {item.weight}kg
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.lineChartBox}>
              {progressData.length === 0 ? (
                <p style={styles.cardText}>Chưa có dữ liệu progress.</p>
              ) : (
                <svg
                  width={`${Math.max(progressData.length * 90, 700)}px`}
                  height="260"
                  viewBox={`0 0 ${Math.max(
                    progressData.length * 90,
                    700
                  )} 260`}
                >
                  <polyline
                    fill="none"
                    stroke="#84cc16"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                  />

                  {chartPoints.map((item) => (
                    <g key={item.id}>
                      <circle cx={item.x} cy={item.y} r="5" fill="#84cc16" />

                      <text
                        x={item.x}
                        y={item.y - 10}
                        textAnchor="middle"
                        fill="white"
                        fontSize="12"
                      >
                        {item.weight}kg
                      </text>

                      <text
                        x={item.x}
                        y="245"
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="10"
                      >
                        {item.date}
                      </text>
                    </g>
                  ))}
                </svg>
              )}
            </div>
          </div>

          <div style={styles.goalBox}>
            <h2 style={styles.sectionTitle}>🎯 Goal Progress</h2>

            <h1 style={styles.goalPercent}>{progress.toFixed(0)}%</h1>

            <div style={styles.progressBg}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`,
                }}
              ></div>
            </div>

            <p style={styles.goalText}>
              {currentWeight}kg → {targetWeight}kg
            </p>

            <div style={styles.changeBox}>
              <h3 style={styles.photoTitle}>⚖ Weight Change</h3>

              <p style={styles.changeText}>
                Start weight: <strong>{startWeight}kg</strong>
              </p>

              <p style={styles.changeText}>
                Current weight: <strong>{latestWeight}kg</strong>
              </p>

              <p style={styles.changeText}>
                Changed:{" "}
                <strong>{(latestWeight - startWeight).toFixed(1)}kg</strong>
              </p>
            </div>
          </div>
        </div>

        <div style={styles.bottomGrid}>
          <div style={styles.aiBox}>
            <h2 style={styles.aiTitle}>AI Progress Analysis</h2>

            <p style={styles.aiText}>Based on your latest progress:</p>

            <ul style={styles.tipList}>
              <li>Current weight: {current.weight} KG</li>
              <li>Current BMI: {current.bmi}</li>
              <li>Updated date: {current.date}</li>
              <li>
                {current.note ||
                  "Hãy cập nhật cân nặng ở Profile để xem phân tích."}
              </li>
            </ul>

            <div style={styles.aiCircle} onClick={() => onNavigate("ai-coach")}>
              AI
            </div>
          </div>

          <div style={styles.noteBox}>
            <h2 style={styles.sectionTitle}>📝 Weight Update History</h2>

            {progressData.length === 0 ? (
              <p style={styles.cardText}>Chưa có lịch sử cập nhật.</p>
            ) : (
              progressData.map((item) => (
                <div style={styles.noteCard} key={item.id}>
                  <h3>{item.date}</h3>
                  <p>
                    Weight: <strong>{item.weight}kg</strong> | BMI:{" "}
                    <strong>{item.bmi}</strong>
                  </p>
                  <p>{item.note || "Không có ghi chú"}</p>
                </div>
              ))
            )}
          </div>
        </div>
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
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    marginBottom: "25px",
  },

  card: {
    background: "#111827",
    padding: "25px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
  },

  cardText: {
    color: "#94a3b8",
  },

  healthy: {
    color: "#84cc16",
    fontWeight: "bold",
  },

  smallTitle: {
    fontSize: "28px",
  },

  editBtn: {
  padding: "8px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(132,204,22,0.4)",
  background: "transparent",
  color: "#84cc16",
  fontWeight: "bold",
  cursor: "pointer",
},

  inlineEdit: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    marginTop: "12px",
  },

  smallInput: {
    width: "90px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    outline: "none",
  },

  miniSaveBtn: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "none",
    background: "#84cc16",
    color: "#0f172a",
    fontWeight: "bold",
    cursor: "pointer",
  },

  cancelBtn: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "none",
    background: "#1f2937",
    color: "white",
    cursor: "pointer",
  },

  middleGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "25px",
    marginBottom: "25px",
  },

  chartBox: {
    background: "#111827",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
  },

  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  sectionTitle: {
    color: "#84cc16",
  },

  select: {
    padding: "12px",
    borderRadius: "12px",
    background: "#1f2937",
    color: "white",
    border: "none",
  },

  goalBox: {
    background: "#111827",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
  },

  goalPercent: {
    fontSize: "64px",
    color: "#84cc16",
    marginBottom: "20px",
  },

  progressBg: {
    width: "100%",
    height: "16px",
    background: "#1f2937",
    borderRadius: "999px",
    marginBottom: "15px",
  },

  progressFill: {
    height: "100%",
    background: "#84cc16",
    borderRadius: "999px",
  },

  goalText: {
    color: "#94a3b8",
    marginBottom: "35px",
  },

  changeBox: {
    marginTop: "20px",
    background: "#0f172a",
    padding: "20px",
    borderRadius: "18px",
    border: "1px solid #1f2937",
  },

  photoTitle: {
    color: "#84cc16",
    marginBottom: "18px",
  },

  changeText: {
    color: "#cbd5e1",
    lineHeight: "1.8",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
  },

  aiBox: {
    background: "linear-gradient(180deg,#111827,#1e293b)",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.3)",
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
    marginTop: "35px",
    boxShadow: "0 0 40px rgba(132,204,22,0.5)",
    cursor: "pointer",
    transition: "0.3s",
  },

  noteBox: {
    background: "#111827",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
    maxHeight: "520px",
    overflowY: "auto",
  },

  noteCard: {
    background: "#0f172a",
    padding: "18px",
    borderRadius: "18px",
    marginBottom: "16px",
    border: "1px solid #1f2937",
  },

  lineChartBox: {
    height: "300px",
    overflowX: "auto",
    overflowY: "hidden",
  },
};

export default Progress;