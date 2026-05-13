function Landing({ onStart }) {
  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <nav style={styles.navbar}>

        <h1 style={styles.logo}>
          FITNESS<span style={styles.green}>UT</span>
        </h1>

        <div style={styles.navRight}>

          <button style={styles.loginBtn}>
            Login
          </button>

        
        </div>

      </nav>

      {/* HERO */}
      <div style={styles.hero}>

        {/* LEFT */}
        <div style={styles.left}>

          <p style={styles.smallText}>
            #1 AI fitness tracking app
          </p>

          <h1 style={styles.title}>
            Fitness tracking
            <br />
            for <span style={styles.highlight}>
              real results
            </span>
          </h1>

          <p style={styles.desc}>
            Build your dream body with AI-powered
            workout plans, smart nutrition tracking,
            and personalized fitness guidance.
          </p>

          <button
            style={styles.startBtn}

            onClick={onStart}
          >
            BẮT ĐẦU NGAY →
          </button>

        </div>

        {/* RIGHT */}
        <div style={styles.right}>

          <div style={styles.phone}>

            <div style={styles.phoneScreen}>

              <div style={styles.appHeader}>
                Today
              </div>

              <div style={styles.card}>

                <p style={styles.cardTitle}>
                  Calories
                </p>

                <h2>1,250 kcal</h2>

                <div style={styles.progressBg}>
                  <div style={styles.progress}></div>
                </div>

              </div>

              <div style={styles.macroRow}>

                <div style={styles.macroCard}>
                  <p>Protein</p>
                  <h3>120g</h3>
                </div>

                <div style={styles.macroCard}>
                  <p>Carbs</p>
                  <h3>180g</h3>
                </div>

                <div style={styles.macroCard}>
                  <p>Fat</p>
                  <h3>50g</h3>
                </div>

              </div>

              <div style={styles.workoutCard}>

                <p style={styles.cardTitle}>
                  Today Workout
                </p>

                <h3>Chest & Triceps 💪</h3>

                <p style={styles.gray}>
                  6 Exercises • 90 mins
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",

    background:
      "linear-gradient(135deg,#0f172a,#111827)",

    color: "white",

    fontFamily: "Arial, sans-serif",

    padding: "30px 80px",

    overflow: "hidden",
  },

  navbar: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",
  },

  logo: {
    fontSize: "38px",

    fontWeight: "bold",
  },

  green: {
    color: "#84cc16",
  },

  navRight: {
    display: "flex",

    gap: "16px",
  },

  loginBtn: {
    padding: "12px 24px",

    borderRadius: "40px",

    border: "1px solid #374151",

    background: "transparent",

    color: "white",

    cursor: "pointer",

    fontWeight: "bold",
  },

  registerBtn: {
    padding: "12px 24px",

    borderRadius: "40px",

    border: "none",

    background: "#84cc16",

    color: "#111827",

    fontWeight: "bold",

    cursor: "pointer",
  },

  hero: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: "70px",
  },

  left: {
    width: "50%",
  },

  smallText: {
    color: "#84cc16",

    fontWeight: "bold",

    marginBottom: "20px",
  },

  title: {
    fontSize: "84px",

    lineHeight: "1.05",

    marginBottom: "30px",
  },

  highlight: {
    background: "#84cc16",

    color: "#111827",

    padding: "0 14px",

    borderRadius: "10px",
  },

  desc: {
    width: "600px",

    fontSize: "22px",

    color: "#9ca3af",

    lineHeight: "1.7",

    marginBottom: "40px",
  },

  startBtn: {
    padding: "20px 42px",

    borderRadius: "50px",

    border: "none",

    background: "#84cc16",

    color: "#111827",

    fontSize: "20px",

    fontWeight: "bold",

    cursor: "pointer",

    boxShadow:
      "0 0 30px rgba(132,204,22,0.4)",
  },

  right: {
    width: "50%",

    display: "flex",

    justifyContent: "center",
  },

  phone: {
    width: "360px",

    height: "720px",

    background: "#000",

    borderRadius: "50px",

    padding: "16px",

    boxShadow:
      "0 0 60px rgba(132,204,22,0.2)",
  },

  phoneScreen: {
    width: "100%",

    height: "100%",

    background: "#f8fafc",

    borderRadius: "40px",

    padding: "24px",

    boxSizing: "border-box",

    color: "#111827",
  },

  appHeader: {
    fontSize: "34px",

    fontWeight: "bold",

    marginBottom: "30px",
  },

  card: {
    background: "white",

    padding: "20px",

    borderRadius: "24px",

    marginBottom: "20px",

    boxShadow:
      "0 4px 20px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    color: "#6b7280",

    marginBottom: "10px",
  },

  progressBg: {
    width: "100%",

    height: "10px",

    background: "#e5e7eb",

    borderRadius: "999px",

    marginTop: "20px",
  },

  progress: {
    width: "70%",

    height: "100%",

    background: "#84cc16",

    borderRadius: "999px",
  },

  macroRow: {
    display: "flex",

    gap: "12px",

    marginBottom: "20px",
  },

  macroCard: {
    flex: 1,

    background: "white",

    padding: "18px",

    borderRadius: "20px",

    textAlign: "center",

    boxShadow:
      "0 4px 20px rgba(0,0,0,0.08)",
  },

  workoutCard: {
    background: "white",

    padding: "24px",

    borderRadius: "24px",

    boxShadow:
      "0 4px 20px rgba(0,0,0,0.08)",
  },

  gray: {
    color: "#6b7280",
  },
};

export default Landing;