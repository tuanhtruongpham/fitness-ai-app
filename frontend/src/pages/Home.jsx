import { useEffect, useState } from "react";
import axios from "axios";

function Home({ onNavigate, onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [completedExercises, setCompletedExercises] = useState(() => {
    return JSON.parse(localStorage.getItem("completedExercises")) || [];
  });

  useEffect(() => {
    fetchDashboard();
    fetchNotifications();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://fitness-ai-app-71hw.onrender.com/api/dashboard",
        {
          headers: {
            authorization: token,
          },
        }
      );

      setDashboard(res.data.dashboard);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://fitness-ai-app-71hw.onrender.com/api/notifications",
        {
          headers: {
            authorization: token,
          },
        }
      );

      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "https://fitness-ai-app-71hw.onrender.com/api/notifications/read",
        {},
        {
          headers: {
            authorization: token,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const toggleCompleted = (exerciseName) => {
    setCompletedExercises((prev) => {
      const updated = prev.includes(exerciseName)
        ? prev.filter((name) => name !== exerciseName)
        : [...prev, exerciseName];

      localStorage.setItem("completedExercises", JSON.stringify(updated));
      return updated;
    });
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return 0;

    const h = height / 100;
    return (weight / (h * h)).toFixed(1);
  };

  const realtimeBMI = calculateBMI(
    dashboard?.latestWeight,
    dashboard?.user?.height
  );

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div>
          <h1 style={styles.logo}>
            FITNESS <span style={styles.green}>UT</span>
          </h1>

          <div style={styles.menu}>
            <div style={styles.activeMenu} onClick={() => onNavigate("home")}>
              🏠 Dashboard
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("workout")}>
              💪 Workout
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("meal")}>
              🍽 Meal Plan
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("progress")}>
              📈 Progress
            </div>

            <div
              style={styles.menuItem}
              onClick={() => onNavigate("ai-coach")}
            >
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
            <h1 style={styles.title}>
              Good Evening, {dashboard?.user?.fullName || "User"} 💪
            </h1>

            <p style={styles.subtitle}>Your body is improving today.</p>
          </div>

          <div style={styles.notificationWrapper}>
            <button
              style={styles.notificationBtn}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔

              {unreadCount > 0 && (
                <span style={styles.notificationBadge}>{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div style={styles.notificationBox}>
                <div style={styles.notificationHeader}>
                  <h3 style={{ margin: 0 }}>Notifications</h3>

                  <button style={styles.markReadBtn} onClick={markAllAsRead}>
                    Mark all as read
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <p style={styles.emptyNotification}>No notifications yet.</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        ...styles.notificationItem,
                        background: item.isRead ? "#0f172a" : "#1e293b",
                      }}
                    >
                      <h4 style={styles.notificationTitle}>{item.title}</h4>

                      <p style={styles.notificationMessage}>{item.message}</p>

                      <span style={styles.notificationTime}>
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.card}>
            <h3>🔥 Workouts</h3>
            <h1>{dashboard?.todayWorkoutName || "Rest Day"}</h1>
            <p style={styles.cardText}>Today's workout</p>
          </div>

          <div style={styles.card}>
            <h3>💪 Exercises</h3>
            <h1>{dashboard?.todayExercises || 0}</h1>
            <p style={styles.cardText}>Exercises today</p>
          </div>

          <div style={styles.card}>
            <h3>⚖ Weight</h3>
            <h1>{dashboard?.latestWeight || 0} KG</h1>
            <p style={styles.cardText}>Current weight</p>
          </div>

          <div style={styles.card}>
            <h3>📈 BMI</h3>
            <h1>{realtimeBMI || 0}</h1>
            <p style={styles.cardText}>Current BMI</p>
          </div>
        </div>

        <div style={styles.aiCard}>
          <div>
            <h2 style={styles.aiTitle}>🤖 AI Coach Recommendation</h2>

            <p style={styles.aiText}>
              Based on your BMI and progress, today you should focus on:
            </p>

            <ul style={styles.list}>
              <li>Goal: {dashboard?.user?.goal || "maintenance"}</li>

              <li>
                BMI Class: {dashboard?.aiRecommendation?.bmiClass || "normal"}
              </li>

              <li>
                AI Split: {dashboard?.aiRecommendation?.split || "Full Body"}
              </li>

              <li>
                Cardio: {dashboard?.aiRecommendation?.cardio?.type || "Walking"}
                {" - "}
                {dashboard?.aiRecommendation?.cardio?.duration || 0} min
              </li>

              <li>
                Weekly Volume:{" "}
                {dashboard?.aiRecommendation?.volume || "6-10 sets"}
              </li>

              <li>
                {dashboard?.aiRecommendation?.recommendation ||
                  "AI recommendation unavailable"}
              </li>
            </ul>

            <div style={styles.ruleBox}>
              {dashboard?.aiRecommendation?.rulesApplied?.map((rule) => (
                <span key={rule} style={styles.ruleTag}>
                  {rule}
                </span>
              ))}
            </div>
          </div>

          <button style={styles.aiCircle} onClick={() => onNavigate("ai-coach")}>
            AI
          </button>
        </div>

        <div style={styles.todayWorkoutBox}>
          <h2 style={styles.sectionTitle}>📅 Today Workout</h2>

          <h1>{dashboard?.todayWorkout?.name}</h1>

          <p style={styles.cardText}>{dashboard?.todayWorkout?.day}</p>

          {dashboard?.todayWorkout?.exercises?.length > 0 ? (
            <div style={styles.exerciseGrid}>
              {dashboard.todayWorkout.exercises.map((exercise) => {
                const isCompleted = completedExercises.includes(exercise.name);

                return (
                  <div key={exercise.name} style={styles.exerciseItem}>
                    <div style={styles.exerciseHeader}>
                      <div
                        style={styles.exerciseName}
                        onClick={() => {
                          localStorage.setItem(
                            "selectedExercise",
                            exercise.name
                          );
                          localStorage.setItem(
                            "selectedWorkout",
                            dashboard?.todayWorkout?.name
                          );
                          onNavigate("workout");
                        }}
                      >
                        💪 {exercise.name}
                      </div>

                      <button
                        style={isCompleted ? styles.checkedBtn : styles.checkBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompleted(exercise.name);
                        }}
                      >
                        {isCompleted ? "✓" : ""}
                      </button>
                    </div>

                    <p style={styles.cardText}>
                      {exercise.sets ? `${exercise.sets} sets` : ""}
                      {exercise.reps ? ` x ${exercise.reps}` : ""}
                      {exercise.duration ? ` - ${exercise.duration}` : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={styles.cardText}>Hôm nay nghỉ để phục hồi cơ bắp.</p>
          )}
        </div>

        <div style={styles.bottomGrid}>
          <div style={styles.bigCard}>
            <h2 style={styles.sectionTitle}>💪 Dashboard Summary</h2>

            <div style={styles.workoutItem}>
              <span>Total Workouts</span>
              <span>{dashboard?.totalWorkouts || 0}</span>
            </div>

            <div style={styles.workoutItem}>
              <span>Total Exercises</span>
              <span>{dashboard?.totalExercises || 0}</span>
            </div>

            <div style={styles.workoutItem}>
              <span>Completed</span>
              <span>{completedExercises.length}</span>
            </div>

            <div style={styles.workoutItem}>
              <span>Meal Plans</span>
              <span>{dashboard?.totalMealPlans || 0}</span>
            </div>
          </div>

          <div style={styles.bigCard}>
            <h2 style={styles.sectionTitle}>📅 Weekly Workout Schedule</h2>

            {dashboard?.weeklySchedule?.map((item) => (
              <div key={item.day} style={styles.workoutItem}>
                <span>{item.day}</span>

                <span>
                  {item.name}
                  {item.exercises?.length > 0
                    ? ` (${item.exercises.length} bài)`
                    : ""}
                </span>
              </div>
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
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    background: "#111827",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: "1px solid #1f2937",
    overflowY: "auto",
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
    marginBottom: "120px",
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

  notificationWrapper: {
    position: "relative",
  },

  notificationBtn: {
    position: "relative",
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "28px",
    cursor: "pointer",
  },

  notificationBadge: {
    position: "absolute",
    top: "-6px",
    right: "-8px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    fontSize: "12px",
    padding: "2px 6px",
    fontWeight: "bold",
  },

  notificationBox: {
    position: "absolute",
    top: "45px",
    right: 0,
    width: "390px",
    maxHeight: "420px",
    overflowY: "auto",
    background: "#111827",
    border: "1px solid rgba(132,204,22,0.4)",
    borderRadius: "18px",
    padding: "18px",
    zIndex: 999,
    boxShadow: "0 0 30px rgba(132,204,22,0.25)",
  },

  notificationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  markReadBtn: {
    background: "transparent",
    border: "none",
    color: "#84cc16",
    cursor: "pointer",
    fontWeight: "bold",
  },

  notificationItem: {
    padding: "14px",
    borderRadius: "14px",
    marginBottom: "10px",
    border: "1px solid #1f2937",
  },

  notificationTitle: {
    margin: 0,
    color: "white",
    fontSize: "15px",
  },

  notificationMessage: {
    margin: "8px 0",
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  notificationTime: {
    color: "#94a3b8",
    fontSize: "12px",
  },

  emptyNotification: {
    color: "#94a3b8",
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
    border: "1px solid rgba(132,204,22,0.2)",
    boxShadow: "0 0 20px rgba(132,204,22,0.08)",
  },

  cardText: {
    color: "#94a3b8",
  },

  aiCard: {
    background: "linear-gradient(90deg,#111827,#1e293b)",
    borderRadius: "28px",
    padding: "35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    border: "1px solid rgba(132,204,22,0.3)",
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
    border: "none",
    background: "#84cc16",
    color: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "40px",
    fontWeight: "bold",
    boxShadow: "0 0 40px rgba(132,204,22,0.5)",
    cursor: "pointer",
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
    border: "1px solid rgba(132,204,22,0.2)",
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

  todayWorkoutBox: {
    background: "#111827",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
    marginBottom: "30px",
  },

  exerciseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px",
    marginTop: "20px",
  },

  exerciseItem: {
    background: "#0f172a",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #1f2937",
  },

  exerciseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },

  exerciseName: {
    cursor: "pointer",
    fontWeight: "bold",
  },

  checkBtn: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    border: "1px solid #84cc16",
    background: "transparent",
    color: "#84cc16",
    cursor: "pointer",
    fontWeight: "bold",
  },

  checkedBtn: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    border: "none",
    background: "#84cc16",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: "bold",
  },

  ruleBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "20px",
  },

  ruleTag: {
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#84cc16",
    color: "#0f172a",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

export default Home;