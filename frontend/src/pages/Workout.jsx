function Workout({ onNavigate, onLogout }) {
  const muscleGroups = [
    "Chest",
    "Back",
    "Shoulder",
    "Biceps",
    "Triceps",
    "Legs",
    "Abs",
    "Cardio",
  ];

  const exercises = {
    Chest: [
      {
        name: "Bench Press",
        level: "Intermediate",
        sets: "4 sets x 8-10 reps",
        desc: "Bài tập chính cho cơ ngực, tay sau và vai trước.",
      },
      {
        name: "Push Up",
        level: "Beginner",
        sets: "3 sets x 12-20 reps",
        desc: "Bài tập ngực cơ bản, có thể tập ở nhà.",
      },
      {
        name: "Incline Dumbbell Press",
        level: "Intermediate",
        sets: "4 sets x 10-12 reps",
        desc: "Tập trung vào phần ngực trên.",
      },
    ],

    Back: [
      {
        name: "Lat Pulldown",
        level: "Beginner",
        sets: "4 sets x 10-12 reps",
        desc: "Giúp phát triển cơ xô và lưng rộng.",
      },
      {
        name: "Barbell Row",
        level: "Intermediate",
        sets: "4 sets x 8-10 reps",
        desc: "Bài tập lưng giữa, hỗ trợ tăng độ dày cơ lưng.",
      },
    ],

    Shoulder: [
      {
        name: "Shoulder Press",
        level: "Intermediate",
        sets: "4 sets x 8-10 reps",
        desc: "Bài tập chính cho vai trước và vai giữa.",
      },
      {
        name: "Lateral Raise",
        level: "Beginner",
        sets: "4 sets x 12-15 reps",
        desc: "Giúp vai rộng và rõ nét hơn.",
      },
    ],

    Biceps: [
      {
        name: "Barbell Curl",
        level: "Beginner",
        sets: "3 sets x 10-12 reps",
        desc: "Bài tập cơ tay trước cơ bản.",
      },
      {
        name: "Hammer Curl",
        level: "Beginner",
        sets: "3 sets x 12 reps",
        desc: "Tập tay trước và cẳng tay.",
      },
    ],

    Triceps: [
      {
        name: "Tricep Pushdown",
        level: "Beginner",
        sets: "3 sets x 12-15 reps",
        desc: "Bài tập tay sau với cáp.",
      },
      {
        name: "Overhead Extension",
        level: "Intermediate",
        sets: "3 sets x 10-12 reps",
        desc: "Tập trung vào phần tay sau dài.",
      },
    ],

    Legs: [
      {
        name: "Squat",
        level: "Intermediate",
        sets: "4 sets x 8-10 reps",
        desc: "Bài tập chính cho đùi trước, mông và core.",
      },
      {
        name: "Leg Press",
        level: "Beginner",
        sets: "4 sets x 10-12 reps",
        desc: "Bài tập chân dễ kiểm soát hơn squat.",
      },
      {
        name: "Romanian Deadlift",
        level: "Intermediate",
        sets: "4 sets x 10 reps",
        desc: "Tập đùi sau, mông và lưng dưới.",
      },
    ],

    Abs: [
      {
        name: "Plank",
        level: "Beginner",
        sets: "3 sets x 60s",
        desc: "Bài tập core giúp cải thiện sức mạnh thân người.",
      },
      {
        name: "Hanging Leg Raise",
        level: "Intermediate",
        sets: "3 sets x 12-15 reps",
        desc: "Tập trung vào bụng dưới.",
      },
    ],

    Cardio: [
      {
        name: "Incline Walk",
        level: "Beginner",
        sets: "20-30 minutes",
        desc: "Đi bộ dốc giúp đốt calories và tốt cho tim mạch.",
      },
      {
        name: "Cycling",
        level: "Beginner",
        sets: "20-40 minutes",
        desc: "Đạp xe giúp tăng sức bền và giảm mỡ.",
      },
    ],
  };

  const selectedGroup = "Chest";
  const currentExercises = exercises[selectedGroup];

  return (
    <div style={styles.page}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div>
          <h1 style={styles.logo}>
            FITNESS <span style={styles.green}>UT</span>
          </h1>

          <div style={styles.menu}>
            <div style={styles.menuItem} onClick={() => onNavigate("home")}>
              🏠 Dashboard
            </div>

            <div style={styles.activeMenu} onClick={() => onNavigate("workout")}>
              💪 Workout
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("meal")}>
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

      {/* MAIN */}
      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Workout Library 💪</h1>
            <p style={styles.subtitle}>
              Choose a muscle group and explore exercises with videos and details.
            </p>
          </div>

          <div style={styles.profile}>🔔 👤</div>
        </div>

        <div style={styles.layout}>
          {/* EXERCISES */}
          <div style={styles.exerciseSection}>
            <h2 style={styles.sectionTitle}>Chest Exercises</h2>

            <div style={styles.exerciseGrid}>
              {currentExercises.map((exercise) => (
                <div key={exercise.name} style={styles.exerciseCard}>
                  <div style={styles.videoBox}>Video will be added later</div>

                  <h3>{exercise.name}</h3>

                  <p style={styles.level}>{exercise.level}</p>

                  <p style={styles.sets}>{exercise.sets}</p>

                  <p style={styles.desc}>{exercise.desc}</p>

                  <button style={styles.detailBtn}>
                    View Detail →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT FILTER */}
          <div style={styles.filterBox}>
            <h2 style={styles.filterTitle}>Muscle Group</h2>

            {muscleGroups.map((group) => (
              <button
                key={group}
                style={
                  group === selectedGroup
                    ? styles.activeGroupBtn
                    : styles.groupBtn
                }
              >
                {group}
              </button>
            ))}
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

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: "28px",
  },

  exerciseSection: {
    background: "#111827",
    borderRadius: "24px",
    padding: "30px",
    border: "1px solid rgba(132,204,22,0.2)",
  },

  sectionTitle: {
    color: "#84cc16",
    marginBottom: "25px",
  },

  exerciseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "22px",
  },

  exerciseCard: {
    background: "#0f172a",
    padding: "22px",
    borderRadius: "20px",
    border: "1px solid #1f2937",
  },

  videoBox: {
    height: "180px",
    borderRadius: "16px",
    background: "#1f2937",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#94a3b8",
    marginBottom: "18px",
  },

  level: {
    color: "#84cc16",
    fontWeight: "bold",
  },

  sets: {
    color: "#cbd5e1",
  },

  desc: {
    color: "#94a3b8",
    lineHeight: "1.6",
  },

  detailBtn: {
    marginTop: "12px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "12px",
    background: "#84cc16",
    color: "#0f172a",
    fontWeight: "bold",
    cursor: "pointer",
  },

  filterBox: {
    background: "#111827",
    borderRadius: "24px",
    padding: "25px",
    border: "1px solid rgba(132,204,22,0.2)",
    height: "fit-content",
  },

  filterTitle: {
    color: "#84cc16",
    marginBottom: "20px",
  },

  groupBtn: {
    width: "100%",
    padding: "16px",
    marginBottom: "12px",
    borderRadius: "14px",
    border: "none",
    background: "#1f2937",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "left",
  },

  activeGroupBtn: {
    width: "100%",
    padding: "16px",
    marginBottom: "12px",
    borderRadius: "14px",
    border: "none",
    background: "#84cc16",
    color: "#0f172a",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "left",
  },
};

export default Workout;