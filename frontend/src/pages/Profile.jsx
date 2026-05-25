import { useEffect, useState } from "react";
import axios from "axios";

function Profile({ onNavigate, onLogout }) {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    avatar: "",
    password: "",
    age: "",
    gender: "",
    weight: "",
    targetWeight: "",
    height: "",
    activity: "",
    goal: "",
    trainingFocus: "",
    dietType: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const getGoalText = (goal) => {
    if (goal === "fat_loss") return "Giảm mỡ";
    if (goal === "muscle_gain") return "Tăng cơ";
    if (goal === "maintenance") return "Duy trì";
    if (goal === "weight_gain") return "Tăng cân";
    return "Chưa có mục tiêu";
  };

  const getActivityText = (activity) => {
    if (activity === "sedentary") return "Ít vận động";
    if (activity === "light") return "Vận động nhẹ";
    if (activity === "moderate") return "Vận động vừa";
    if (activity === "active") return "Rất năng động";
    return "Chưa cập nhật";
  };

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
        age: data.age || "",
        gender: data.gender || "",
        weight: data.weight || "",
        targetWeight: data.targetWeight || "",
        height: data.height || "",
        activity: data.activity || "",
        goal: data.goal || "",
        trainingFocus: data.trainingFocus || "",
        dietType: data.dietType || "normal",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const calculateBMI = () => {
    if (!form.weight || !form.height) return 0;

    const h = Number(form.height) / 100;
    return (Number(form.weight) / (h * h)).toFixed(1);
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

      const payload = {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        targetWeight: form.targetWeight ? Number(form.targetWeight) : undefined,
        height: form.height ? Number(form.height) : undefined,
        bmi: calculateBMI(),
      };

      const res = await axios.put(
        "https://fitness-ai-app-71hw.onrender.com/api/profile/update",
        payload,
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
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
           "https://fitness-ai-app-71hw.onrender.com/api/profile/avatar",
        formData,
        {
          headers: {
            authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser({
        ...user,
        avatar: res.data.avatar,
      });
    } catch (error) {
      console.log(error);
      alert("Upload avatar failed");
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
            <div style={styles.menuItem} onClick={() => onNavigate("home")}>
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

            <div style={styles.menuItem} onClick={() => onNavigate("ai-coach")}>
              🤖 AI Coach
            </div>

            <div style={styles.activeMenu}>👤 Profile</div>
          </div>
        </div>

        <div style={styles.logout} onClick={onLogout}>
          🚪 Logout
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Profile</h1>
          <p style={styles.subtitle}>
            Manage your personal information and nutrition settings
          </p>
        </div>

        <div style={styles.topGrid}>
          <div style={styles.profileCard}>
            <img
             src={
              user?.avatar
                ? `https://fitness-ai-app-71hw.onrender.com/uploads/${user.avatar}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
              alt="avatar"
              style={styles.avatar}
            />

            <h2 style={styles.userName}>{user?.fullName || "User"}</h2>

            <p style={styles.email}>{user?.email}</p>

            <div style={styles.goalTag}>{getGoalText(form.goal)}</div>
          </div>

          <div style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>📊 Fitness Information</h2>

            <div style={styles.infoRow}>
              <span>Age</span>
              <strong>{form.age || "Not set"}</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Gender</span>
              <strong>{form.gender || "Not set"}</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Current Weight</span>
              <strong>{form.weight || "-"} KG</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Target Weight</span>
              <strong>{form.targetWeight || "-"} KG</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Height</span>
              <strong>{form.height || "-"} CM</strong>
            </div>

            <div style={styles.infoRow}>
              <span>BMI</span>
              <strong>{calculateBMI()}</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Activity</span>
              <strong>{getActivityText(form.activity)}</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Goal</span>
              <strong>{getGoalText(form.goal)}</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Diet Type</span>
              <strong>{form.dietType || "-"}</strong>
            </div>
          </div>
        </div>

        <div style={styles.formCard}>
          <h2 style={styles.sectionTitle}>⚙ Edit Profile</h2>

          <div style={styles.formGrid}>
            <input
              style={styles.input}
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
            />

            <label style={styles.fileUploadBox}>
              📁 Choose Avatar
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
            </label>

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
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input
              style={styles.input}
              name="weight"
              type="number"
              placeholder="Current Weight"
              value={form.weight}
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
              name="height"
              type="number"
              placeholder="Height"
              value={form.height}
              onChange={handleChange}
            />

            <select
              style={styles.input}
              name="activity"
              value={form.activity}
              onChange={handleChange}
            >
              <option value="">Activity Level</option>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
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

            <select
              style={styles.input}
              name="trainingFocus"
              value={form.trainingFocus}
              onChange={handleChange}
            >
              <option value="">Training Focus</option>
              <option value="general">General Fitness</option>
              <option value="muscle">Muscle Building</option>
              <option value="endurance">Endurance</option>
            </select>

            <select
              style={styles.input}
              name="dietType"
              value={form.dietType}
              onChange={handleChange}
            >
              <option value="">Diet Type</option>
              <option value="normal">Normal</option>
              <option value="high_protein">High Protein</option>
              <option value="low_carb">Low Carb</option>
              <option value="vegetarian">Vegetarian</option>
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
    position: "fixed",
    left: 0,
    top: 0,
    height: "100vh",
    flexShrink: 0,
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
    marginBottom: "120px",
  },

  main: {
    flex: 1,
    padding: "40px",
    marginLeft: "320px",
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
    minHeight: "250px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #84cc16",
    marginBottom: "20px",
  },

  userName: {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "10px",
    marginBottom: "6px",
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
    gridTemplateColumns: "1fr 1fr",
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

  fileUploadBox: {
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "54px",
    transition: "0.3s",
    boxSizing: "border-box",
  },

  saveBtn: {
    marginTop: "28px",
    padding: "16px 32px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(90deg,#84cc16,#65a30d)",
    color: "#0f172a",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },
};

export default Profile;