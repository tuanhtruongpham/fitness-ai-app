function Home() {
  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>

        <div>

          <h1 style={styles.logo}>
            FITNESS <span style={styles.green}>AI</span>
          </h1>

          <div style={styles.menu}>

            <div style={styles.activeMenu}>
              🏠 Dashboard
            </div>

            <div style={styles.menuItem}>
              💪 Workout
            </div>

            <div style={styles.menuItem}>
              🍽 Meal Plan
            </div>

            <div style={styles.menuItem}>
              📈 Progress
            </div>

            <div style={styles.menuItem}>
              🤖 AI Coach
            </div>

            <div style={styles.menuItem}>
              👤 Profile
            </div>

            <div style={styles.menuItem}>
              ⚙ Settings
            </div>

          </div>

        </div>

        <div style={styles.logout}>
          🚪 Logout
        </div>

      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* HEADER */}
        <div style={styles.header}>

          <div>
            <h1 style={styles.title}>
              Good Evening, Uy 💪
            </h1>

            <p style={styles.subtitle}>
              Your body is improving today.
            </p>
          </div>

          <div style={styles.profile}>
            🔔 👤
          </div>

        </div>

        {/* STATS */}
        <div style={styles.statsGrid}>

          <div style={styles.card}>
            <h3>🔥 Calories</h3>

            <h1>2,450</h1>

            <p style={styles.cardText}>
              Daily target
            </p>
          </div>

          <div style={styles.card}>
            <h3>💪 Workout</h3>

            <h1>Chest Day</h1>

            <p style={styles.cardText}>
              5 exercises today
            </p>
          </div>

          <div style={styles.card}>
            <h3>⚖ Weight</h3>

            <h1>72 KG</h1>

            <p style={styles.cardText}>
              Current weight
            </p>
          </div>

          <div style={styles.card}>
            <h3>📈 BMI</h3>

            <h1>22.1</h1>

            <p style={styles.cardText}>
              Healthy range
            </p>
          </div>

        </div>

        {/* AI COACH */}
        <div style={styles.aiCard}>

          <div>

            <h2 style={styles.aiTitle}>
              🤖 AI Coach Recommendation
            </h2>

            <p style={styles.aiText}>
              Based on your BMI and progress,
              today you should focus on:
            </p>

            <ul style={styles.list}>
              <li>Chest Workout</li>
              <li>Triceps Training</li>
              <li>High Protein Intake</li>
              <li>Drink 3L of Water</li>
            </ul>

          </div>

          <div style={styles.aiCircle}>
            AI
          </div>

        </div>

        {/* BOTTOM */}
        <div style={styles.bottomGrid}>

          {/* WORKOUT */}
          <div style={styles.bigCard}>

            <h2 style={styles.sectionTitle}>
              💪 Today's Workout
            </h2>

            <div style={styles.workoutItem}>
              <span>Bench Press</span>
              <span>4 x 10</span>
            </div>

            <div style={styles.workoutItem}>
              <span>Incline Dumbbell</span>
              <span>4 x 12</span>
            </div>

            <div style={styles.workoutItem}>
              <span>Push Up</span>
              <span>3 x 20</span>
            </div>

            <div style={styles.workoutItem}>
              <span>Cable Fly</span>
              <span>4 x 15</span>
            </div>

          </div>

          {/* MEAL */}
          <div style={styles.bigCard}>

            <h2 style={styles.sectionTitle}>
              🍽 Meal Plan
            </h2>

            <div style={styles.workoutItem}>
              <span>Breakfast</span>
              <span>520 cal</span>
            </div>

            <div style={styles.workoutItem}>
              <span>Lunch</span>
              <span>740 cal</span>
            </div>

            <div style={styles.workoutItem}>
              <span>Dinner</span>
              <span>680 cal</span>
            </div>

            <div style={styles.workoutItem}>
              <span>Protein</span>
              <span>145g</span>
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

    transition: "0.3s",
  },

  activeMenu: {
    padding: "16px",

    borderRadius: "14px",

    background:
      "linear-gradient(90deg,#84cc16,#65a30d)",

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

  statsGrid: {
    display: "grid",

    gridTemplateColumns: "repeat(4, 1fr)",

    gap: "20px",

    marginBottom: "30px",
  },

  card: {
    background: "#111827",

    padding: "25px",

    borderRadius: "24px",

    border:
      "1px solid rgba(132,204,22,0.2)",

    boxShadow:
      "0 0 20px rgba(132,204,22,0.08)",
  },

  cardText: {
    color: "#94a3b8",
  },

  aiCard: {
    background:
      "linear-gradient(90deg,#111827,#1e293b)",

    borderRadius: "28px",

    padding: "35px",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "30px",

    border:
      "1px solid rgba(132,204,22,0.3)",
  },

  aiTitle: {
    marginBottom: "15px",

    color: "#84cc16",
  },

  aiText: {
    color: "#cbd5e1",

    marginBottom: "20px",

    lineHeight: "1.7",
  },

  list: {
    lineHeight: "2",
  },

  aiCircle: {
    width: "140px",

    height: "140px",

    borderRadius: "50%",

    background: "#84cc16",

    color: "#0f172a",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontSize: "40px",

    fontWeight: "bold",

    boxShadow:
      "0 0 40px rgba(132,204,22,0.5)",
  },

  bottomGrid: {
    display: "grid",

    gridTemplateColumns: "1fr 1fr",

    gap: "25px",
  },

  bigCard: {
    background: "#111827",

    padding: "30px",

    borderRadius: "24px",

    border:
      "1px solid rgba(132,204,22,0.2)",
  },

  sectionTitle: {
    marginBottom: "25px",

    color: "#84cc16",
  },

  workoutItem: {
    display: "flex",

    justifyContent: "space-between",

    padding: "15px 0",

    borderBottom: "1px solid #1f2937",
  },
};

export default Home;