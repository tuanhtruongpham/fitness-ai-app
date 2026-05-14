import { useState } from "react";
import workoutDatabase from "../data/workoutDatabase";

function Workout({ onNavigate, onLogout }) {
  const [selectedGroup, setSelectedGroup] = useState("Chest");
  const [selectedLevel, setSelectedLevel] = useState("Beginner");
  const [selectedExercise, setSelectedExercise] = useState(null);

  const muscleGroups = Object.keys(workoutDatabase);

  const levelInfo = {
    Beginner: "< 6 tháng tập",
    Intermediate: "6 tháng - 2 năm",
    Advanced: "Trên 2 năm",
  };

  const currentData =
    workoutDatabase[selectedGroup]?.[selectedLevel] || {
      home: [],
      gym: [],
    };

  const ExerciseCard = ({ exercise }) => (
    <div style={styles.exerciseCard}>
      <div style={styles.videoBox}>Video will be added later</div>

      <h3>{exercise.name}</h3>
      <p style={styles.level}>{exercise.target}</p>

      <p style={styles.sets}>
        {exercise.sets ? `${exercise.sets} sets` : ""}
        {exercise.reps ? ` x ${exercise.reps} reps` : ""}
        {exercise.time ? ` - ${exercise.time}` : ""}
        {exercise.duration ? ` - ${exercise.duration}` : ""}
      </p>

      <p style={styles.desc}>{exercise.description}</p>

      <button
        style={styles.detailBtn}
        onClick={() => setSelectedExercise(exercise)}
      >
        View Detail →
      </button>
    </div>
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
            <div style={styles.activeMenu}>💪 Workout</div>
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

      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Workout Library 💪</h1>
            <p style={styles.subtitle}>
              Choose muscle group, level, and workout place.
            </p>
          </div>
          <div style={styles.profile}>🔔 👤</div>
        </div>

        <div style={styles.layout}>
          <div style={styles.exerciseSection}>
            <h2 style={styles.sectionTitle}>{selectedGroup} Workout</h2>

            <div style={styles.levelBox}>
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <button
                  key={level}
                  style={
                    selectedLevel === level
                      ? styles.activeLevelBtn
                      : styles.levelBtn
                  }
                  onClick={() => {
                    setSelectedLevel(level);
                    setSelectedExercise(null);
                  }}
                >
                  <b>{level}</b>
                  <span>{levelInfo[level]}</span>
                </button>
              ))}
            </div>

            <h2 style={styles.workoutPlaceTitle}>🏠 Home Workout</h2>
            {currentData.home.length > 0 ? (
              <div style={styles.exerciseGrid}>
                {currentData.home.map((exercise) => (
                  <ExerciseCard key={exercise.name} exercise={exercise} />
                ))}
              </div>
            ) : (
              <div style={styles.emptyBox}>No home workout data yet.</div>
            )}

            <h2 style={styles.workoutPlaceTitle}>🏋️ Gym Workout</h2>
            {currentData.gym.length > 0 ? (
              <div style={styles.exerciseGrid}>
                {currentData.gym.map((exercise) => (
                  <ExerciseCard key={exercise.name} exercise={exercise} />
                ))}
              </div>
            ) : (
              <div style={styles.emptyBox}>No gym workout data yet.</div>
            )}
          </div>

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
                onClick={() => {
                  setSelectedGroup(group);
                  setSelectedLevel("Beginner");
                  setSelectedExercise(null);
                }}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {selectedExercise && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalBox}>
              <button
                style={styles.closeBtn}
                onClick={() => setSelectedExercise(null)}
              >
                ✕
              </button>

              <h2 style={styles.modalTitle}>{selectedExercise.name}</h2>

              <div style={styles.videoDetailBox}>
                {selectedExercise.video ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedExercise.video}
                    title={selectedExercise.name}
                    frameBorder="0"
                    allowFullScreen
                  />
                ) : (
                  "Video hướng dẫn sẽ thêm sau"
                )}
              </div>

              <div style={styles.infoGrid}>
                <p>
                  <b>Level:</b> {selectedExercise.level}
                </p>
                <p>
                  <b>Target:</b> {selectedExercise.target}
                </p>
                <p>
                  <b>Equipment:</b> {selectedExercise.equipment}
                </p>
                <p>
                  <b>Sets:</b> {selectedExercise.sets || "--"}
                </p>
                <p>
                  <b>Reps:</b> {selectedExercise.reps || "--"}
                </p>
                <p>
                  <b>Duration:</b> {selectedExercise.duration || "--"}
                </p>
              </div>

              <p style={styles.modalDesc}>{selectedExercise.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#0f172a", color: "white", fontFamily: "Arial" },
  sidebar: { width: "260px", background: "#111827", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid #1f2937" },
  logo: { fontSize: "30px", marginBottom: "40px" },
  green: { color: "#84cc16" },
  menu: { display: "flex", flexDirection: "column", gap: "16px" },
  menuItem: { padding: "16px", borderRadius: "14px", background: "#1f2937", cursor: "pointer" },
  activeMenu: { padding: "16px", borderRadius: "14px", background: "linear-gradient(90deg,#84cc16,#65a30d)", color: "#0f172a", fontWeight: "bold", cursor: "pointer" },
  logout: { padding: "16px", borderRadius: "14px", background: "#1f2937", textAlign: "center", cursor: "pointer" },
  main: { flex: 1, padding: "40px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px" },
  title: { margin: 0, fontSize: "38px" },
  subtitle: { color: "#94a3b8", marginTop: "10px" },
  profile: { fontSize: "28px" },
  layout: { display: "grid", gridTemplateColumns: "1fr 300px", gap: "28px", alignItems: "start" },
  exerciseSection: { background: "#111827", borderRadius: "24px", padding: "30px", border: "1px solid rgba(132,204,22,0.2)" },
  sectionTitle: { color: "#84cc16", marginBottom: "25px" },
  levelBox: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" },
  levelBtn: { padding: "18px", borderRadius: "18px", border: "1px solid #1f2937", background: "#0f172a", color: "white", cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px", textAlign: "left", fontSize: "16px" },
  activeLevelBtn: { padding: "18px", borderRadius: "18px", border: "none", background: "#84cc16", color: "#0f172a", cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px", textAlign: "left", fontSize: "16px", fontWeight: "bold" },
  workoutPlaceTitle: { color: "#84cc16", marginTop: "28px", marginBottom: "18px" },
  exerciseGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "22px" },
  exerciseCard: { background: "#0f172a", padding: "22px", borderRadius: "20px", border: "1px solid #1f2937" },
  videoBox: { height: "150px", borderRadius: "16px", background: "#1f2937", display: "flex", justifyContent: "center", alignItems: "center", color: "#94a3b8", marginBottom: "18px" },
  level: { color: "#84cc16", fontWeight: "bold" },
  sets: { color: "#cbd5e1" },
  desc: { color: "#94a3b8", lineHeight: "1.6" },
  detailBtn: { marginTop: "12px", padding: "12px 18px", border: "none", borderRadius: "12px", background: "#84cc16", color: "#0f172a", fontWeight: "bold", cursor: "pointer" },
  filterBox: { background: "#111827", borderRadius: "24px", padding: "25px", border: "1px solid rgba(132,204,22,0.2)", height: "fit-content", position: "sticky", top: "30px" },
  filterTitle: { color: "#84cc16", marginBottom: "20px" },
  groupBtn: { width: "100%", padding: "16px", marginBottom: "12px", borderRadius: "14px", border: "none", background: "#1f2937", color: "white", fontWeight: "bold", cursor: "pointer", textAlign: "left" },
  activeGroupBtn: { width: "100%", padding: "16px", marginBottom: "12px", borderRadius: "14px", border: "none", background: "#84cc16", color: "#0f172a", fontWeight: "bold", cursor: "pointer", textAlign: "left" },
  emptyBox: { padding: "30px", borderRadius: "18px", background: "#0f172a", color: "#94a3b8", textAlign: "center" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 },
  modalBox: { width: "720px", maxHeight: "90vh", overflowY: "auto", background: "#111827", borderRadius: "24px", padding: "30px", border: "1px solid rgba(132,204,22,0.4)", position: "relative" },
  closeBtn: { position: "absolute", top: "20px", right: "20px", border: "none", background: "#1f2937", color: "white", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", fontSize: "18px" },
  modalTitle: { color: "#84cc16", marginBottom: "20px" },
  videoDetailBox: { height: "320px", borderRadius: "18px", background: "#1f2937", display: "flex", justifyContent: "center", alignItems: "center", color: "#94a3b8", marginBottom: "20px", overflow: "hidden" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", color: "#cbd5e1" },
  modalDesc: { color: "#cbd5e1", lineHeight: "1.7", marginTop: "20px" },
};

export default Workout;