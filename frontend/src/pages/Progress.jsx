import { useState } from "react";

function Progress({ onNavigate, onLogout }) {
  const [selectedWeek, setSelectedWeek] = useState("Week 4");

  const progressData = [
    {
      week: "Week 1",
      weight: 78,
      bmi: 25.4,
      bodyFat: 24,
    },

    {
      week: "Week 2",
      weight: 76,
      bmi: 24.7,
      bodyFat: 22,
    },

    {
      week: "Week 3",
      weight: 74,
      bmi: 23.5,
      bodyFat: 20,
    },

    {
      week: "Week 4",
      weight: 72,
      bmi: 22.1,
      bodyFat: 18,
    },
  ];

  const current = progressData.find(
    (item) => item.week === selectedWeek
  );

  const goalWeight = 65;
  const startWeight = 78;

  const progressPercent = Math.min(
    Math.round(
      ((startWeight - current.weight) /
        (startWeight - goalWeight)) *
        100
    ),
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

            <div style={styles.menuItem} onClick={() => onNavigate("meal")}>
              🍽 Meal Plan
            </div>

            <div style={styles.activeMenu}>
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
            <h1 style={styles.title}>Progress Tracking 📈</h1>

            <p style={styles.subtitle}>
              Monitor your transformation journey.
            </p>
          </div>

          <div style={styles.profile}>🔔 👤</div>
        </div>

        <div style={styles.topGrid}>
          <div style={styles.card}>
            <h3>⚖ Current Weight</h3>

            <h1>{current.weight} KG</h1>

            <p style={styles.cardText}>
              Start: {startWeight} KG
            </p>
          </div>

          <div style={styles.card}>
            <h3>📊 BMI</h3>

            <h1>{current.bmi}</h1>

            <p style={styles.healthy}>
              Healthy Range
            </p>
          </div>

          <div style={styles.card}>
            <h3>🔥 Body Fat</h3>

            <h1>{current.bodyFat}%</h1>

            <p style={styles.cardText}>
              Lean physique improving
            </p>
          </div>

          <div style={styles.card}>
            <h3>🎯 Goal</h3>

            <h1>{goalWeight} KG</h1>

            <p style={styles.cardText}>
              Goal Progress
            </p>
          </div>
        </div>

        <div style={styles.middleGrid}>
          <div style={styles.chartBox}>
            <div style={styles.chartHeader}>
              <h2 style={styles.sectionTitle}>
                📉 Weight Progress
              </h2>

              <select
                style={styles.select}
                value={selectedWeek}
                onChange={(e) =>
                  setSelectedWeek(e.target.value)
                }
              >
                {progressData.map((item) => (
                  <option key={item.week}>
                    {item.week}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.chartArea}>
              {progressData.map((item) => (
                <div
                  key={item.week}
                  style={styles.chartItem}
                >
                  <div
                    style={{
                      ...styles.chartBar,
                      height: `${item.weight * 3}px`,
                    }}
                  ></div>

                  <span style={styles.chartLabel}>
                    {item.weight}kg
                  </span>

                  <span style={styles.chartWeek}>
                    {item.week}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.goalBox}>
            <h2 style={styles.sectionTitle}>
              🎯 Goal Progress
            </h2>

            <h1 style={styles.goalPercent}>
              {progressPercent}%
            </h1>

            <div style={styles.progressBg}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progressPercent}%`,
                }}
              ></div>
            </div>

            <p style={styles.goalText}>
              {current.weight}kg → {goalWeight}kg
            </p>

            <div style={styles.photoBox}>
              <h3 style={styles.photoTitle}>
                📸 Progress Photos
              </h3>

              <div style={styles.photoGrid}>
                <div style={styles.photoCard}>
                  Front
                </div>

                <div style={styles.photoCard}>
                  Side
                </div>

                <div style={styles.photoCard}>
                  Back
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.bottomGrid}>
          <div style={styles.aiBox}>
            <h2 style={styles.aiTitle}>
              🤖 AI Progress Analysis
            </h2>

            <p style={styles.aiText}>
              Based on your latest progress:
            </p>

            <ul style={styles.tipList}>
              <li>
                Weight decreased steadily.
              </li>

              <li>
                BMI is now in healthy range.
              </li>

              <li>
                Body fat percentage improved.
              </li>

              <li>
                Increase protein slightly for muscle retention.
              </li>

              <li>
                Current training intensity is effective.
              </li>
            </ul>

            <div style={styles.aiCircle}>
              AI
            </div>
          </div>

          <div style={styles.noteBox}>
            <h2 style={styles.sectionTitle}>
              📝 Weekly Notes
            </h2>

            <div style={styles.noteCard}>
              <h3>Week 1</h3>

              <p>
                Started diet and workout plan.
              </p>
            </div>

            <div style={styles.noteCard}>
              <h3>Week 2</h3>

              <p>
                Feeling stronger and more energetic.
              </p>
            </div>

            <div style={styles.noteCard}>
              <h3>Week 3</h3>

              <p>
                Improved cardio endurance.
              </p>
            </div>

            <div style={styles.noteCard}>
              <h3>Week 4</h3>

              <p>
                Visible fat loss and better muscle definition.
              </p>
            </div>
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

  chartArea: {
    height: "320px",
    display: "flex",
    alignItems: "end",
    gap: "25px",
  },

  chartItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "end",
  },

  chartBar: {
    width: "60px",
    background: "#84cc16",
    borderRadius: "16px 16px 0 0",
    boxShadow: "0 0 20px rgba(132,204,22,0.5)",
  },

  chartLabel: {
    marginTop: "10px",
    fontWeight: "bold",
  },

  chartWeek: {
    color: "#94a3b8",
    marginTop: "5px",
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

  photoBox: {
    marginTop: "20px",
  },

  photoTitle: {
    color: "#84cc16",
    marginBottom: "18px",
  },

  photoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
  },

  photoCard: {
    height: "110px",
    borderRadius: "18px",
    background: "#1f2937",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#94a3b8",
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
  },

  noteBox: {
    background: "#111827",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
  },

  noteCard: {
    background: "#0f172a",
    padding: "18px",
    borderRadius: "18px",
    marginBottom: "16px",
    border: "1px solid #1f2937",
  },
};

export default Progress;