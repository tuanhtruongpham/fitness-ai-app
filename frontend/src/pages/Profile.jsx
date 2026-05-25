import { useEffect, useState } from "react";
import axios from "axios";

function Profile({ onNavigate, onLogout }) {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
  fullName: "",
  avatar: "",
  password: "",
  weight: "",
  targetWeight: "",
  height: "",
  age: "",
  gender: "",
  goal: "",
});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
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

      const data = res.data.dashboard.user;

      setUser(data);

      setForm({
  fullName: data.fullName || "",
  avatar: data.avatar || "",
  password: "",
  weight: data.weight || "",
  targetWeight: data.targetWeight || "",
  height: data.height || "",
  age: data.age || "",
  gender: data.gender || "",
  goal: data.goal || "",
});
    } catch (error) {
      console.log(error);
    }
  };

  const calculateBMI = () => {
    if (!form.weight || !form.height) return 0;

    const h = form.height / 100;

    return (form.weight / (h * h)).toFixed(1);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    console.log("PROFILE SAVE:", form);

    const res = await axios.put(
      "http://localhost:5000/api/profile/update",
      {
        ...form,
        bmi: calculateBMI(),
      },
      {
        headers: {
          authorization: token,
        },
      }
    );

    alert("Profile updated!");

    setUser(res.data.user);

    fetchProfile();
  } catch (error) {
    console.log(error);
    alert("Update failed");
  }
};

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div>
          <h1 style={styles.logo}>
            FITNESS <span style={styles.green}>UT</span>
          </h1>

          <div style={styles.menu}>
            <div
              style={styles.menuItem}
              onClick={() => onNavigate("home")}
            >
              🏠 Dashboard
            </div>

            <div
              style={styles.menuItem}
              onClick={() => onNavigate("workout")}
            >
              💪 Workout
            </div>

            <div
              style={styles.menuItem}
              onClick={() => onNavigate("meal")}
            >
              🍽 Meal Plan
            </div>

            <div
              style={styles.menuItem}
              onClick={() => onNavigate("progress")}
            >
              📈 Progress
            </div>

            <div
              style={styles.menuItem}
              onClick={() => onNavigate("ai-coach")}
            >
              🤖 AI Coach
            </div>

            <div style={styles.activeMenu}>
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
            <h1 style={styles.title}>Profile</h1>
            <p style={styles.subtitle}>
              Manage your personal information
            </p>
          </div>
        </div>

        <div style={styles.topGrid}>
          <div style={styles.profileCard}>
            <img
              src={
                form.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="avatar"
              style={styles.avatar}
            />

            <h2>{user?.fullName}</h2>

            <p style={styles.email}>
              {user?.email}
            </p>

            <div style={styles.goalTag}>
              {form.goal || "No Goal"}
            </div>
          </div>

          <div style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>
              📊 Fitness Information
            </h2>

            <div style={styles.infoRow}>
              <span>Weight</span>
              <strong>{form.weight} KG</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Target Weight</span>
              <strong>{form.targetWeight || "Chưa có"} KG</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Height</span>
              <strong>{form.height} CM</strong>
            </div>

            <div style={styles.infoRow}>
              <span>BMI</span>
              <strong>{calculateBMI()}</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Goal</span>
              <strong>{form.goal}</strong>
            </div>
          </div>
        </div>

        <div style={styles.formCard}>
          <h2 style={styles.sectionTitle}>
            ⚙ Edit Profile
          </h2>

          <div style={styles.formGrid}>
            <input
              style={styles.input}
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="avatar"
              placeholder="Avatar URL"
              value={form.avatar}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="password"
              type="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="targetWeight"
              type="number"
              placeholder="Target Weight"
              value={form.targetWeight}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="weight"
              type="number"
              placeholder="Weight"
              value={form.weight}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="height"
              type="number"
              placeholder="Height"
              value={form.height}
              onChange={handleChange}
            />
            <input
              style={styles.input}
              name="age"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
            />

            <select
              style={styles.input}
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select
              style={styles.input}
              name="goal"
              value={form.goal}
              onChange={handleChange}
            >
              <option value="">Select Goal</option>
              <option value="fat_loss">Fat Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="weight_gain">Weight Gain</option>
            </select>
          </div>

          <button style={styles.saveBtn} onClick={handleSave}>
            Save Changes
          </button>
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
    marginBottom: "30px",
  },

  title: {
    fontSize: "38px",
    margin: 0,
  },

  subtitle: {
    color: "#94a3b8",
  },

  topGrid: {
    display: "grid",
    gridTemplateColumns: "350px 1fr",
    gap: "25px",
    marginBottom: "30px",
  },

  profileCard: {
    background: "#111827",
    padding: "35px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
    textAlign: "center",
  },

  avatar: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #84cc16",
    marginBottom: "20px",
  },

  email: {
    color: "#94a3b8",
  },

  goalTag: {
    marginTop: "15px",
    background: "#84cc16",
    color: "#0f172a",
    padding: "10px 18px",
    borderRadius: "999px",
    display: "inline-block",
    fontWeight: "bold",
  },

  infoCard: {
    background: "#111827",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
  },

  sectionTitle: {
    color: "#84cc16",
    marginBottom: "25px",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "18px 0",
    borderBottom: "1px solid #1f2937",
  },

  formCard: {
    background: "#111827",
    padding: "35px",
    borderRadius: "24px",
    border: "1px solid rgba(132,204,22,0.2)",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "18px",
  },

  input: {
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    outline: "none",
  },

  saveBtn: {
    marginTop: "25px",
    padding: "16px 28px",
    borderRadius: "14px",
    border: "none",
    background: "#84cc16",
    color: "#0f172a",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Profile;