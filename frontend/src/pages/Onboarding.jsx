import { useState } from "react";

function Onboarding({ onFinish }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    goal: "",
    activity: "",
    birthDate: "",
    gender: "",
    height: "",
    weight: "",
    workoutPlace: "",
    gymDays: "",
    email: "",
    phone: "",
    password: "",
  });

  const goals = ["Giảm cân", "Giữ cân", "Tăng cân", "Tăng cơ"];

  const activities = [
    { title: "Ít vận động", desc: "Phần lớn thời gian ngồi học, ngồi làm việc." },
    { title: "Vận động nhẹ", desc: "Có đi lại trong ngày nhưng không tập luyện nhiều." },
    { title: "Năng động", desc: "Thường xuyên di chuyển hoặc có tập luyện vài buổi." },
    { title: "Rất năng động", desc: "Tập luyện đều hoặc công việc cần vận động nhiều." },
  ];

  const goalMessage = {
    "Giảm cân":
      "Đừng lo nếu trước đây bạn từng giảm cân thất bại. Fitness AI sẽ giúp bạn theo dõi calories, lên kế hoạch tập luyện và ăn uống rõ ràng hơn mỗi ngày.",
    "Giữ cân":
      "Giữ cân không có nghĩa là đứng yên. Fitness AI sẽ giúp bạn duy trì vóc dáng, kiểm soát dinh dưỡng và cải thiện sức khỏe ổn định.",
    "Tăng cân":
      "Tăng cân lành mạnh không chỉ là ăn nhiều hơn. Fitness AI sẽ giúp bạn tăng calories đúng cách, kết hợp tập luyện để cơ thể khỏe và đẹp hơn.",
    "Tăng cơ":
      "Xây cơ cần sự kiên trì và kế hoạch đúng. Fitness AI sẽ giúp bạn chọn bài tập, theo dõi protein và cải thiện từng tuần.",
  };

  const updateData = (field, value) => {
    setData({ ...data, [field]: value });
    setErrors({ ...errors, [field]: false });
  };

  const calculateBMI = () => {
    const h = Number(data.height) / 100;
    const w = Number(data.weight);
    if (!h || !w) return "";
    return (w / (h * h)).toFixed(1);
  };

  const calculateAge = () => {
    const birth = new Date(data.birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const bmi = calculateBMI();

  const validateStep = () => {
    const newErrors = {};

    if (step === 1 && !data.name.trim()) newErrors.name = true;
    if (step === 2 && !data.goal) newErrors.goal = true;
    if (step === 4 && !data.activity) newErrors.activity = true;

    if (step === 5) {
      if (!data.birthDate) newErrors.birthDate = true;
      if (!data.gender) newErrors.gender = true;
      if (!data.height) newErrors.height = true;
      if (!data.weight) newErrors.weight = true;
    }

    if (step === 6) {
      if (!data.workoutPlace) newErrors.workoutPlace = true;
      if (data.workoutPlace === "gym" && !data.gymDays) {
        newErrors.gymDays = true;
      }
    }

    if (step === 7) {
      if (!data.email.trim()) newErrors.email = true;
      if (!data.phone || !/^[0-9]{10}$/.test(data.phone)) newErrors.phone = true;
      if (!data.password || data.password.length < 8) newErrors.password = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (!validateStep()) return;

    if (step === 7) {
      try {
        setLoading(true);

        const registerResponse = await fetch(
          "http://localhost:5000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullName: data.name,
              phone: data.phone,
              email: data.email,
              password: data.password,
            }),
          }
        );

        const registerResult = await registerResponse.json();

        if (!registerResponse.ok) {
          alert(registerResult.message || "Đăng ký thất bại");
          setLoading(false);
          return;
        }

        localStorage.setItem("token", registerResult.token);
        localStorage.setItem("user", JSON.stringify(registerResult.user));

        const profileResponse = await fetch(
          "http://localhost:5000/api/profile/update",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${registerResult.token}`,
            },
            body: JSON.stringify({
              age: calculateAge(),
              height: Number(data.height) / 100,
              weight: Number(data.weight),
              gender: data.gender,
              goal: data.goal,
            }),
          }
        );

        const profileResult = await profileResponse.json();

        if (!profileResponse.ok) {
          alert(profileResult.message || "Cập nhật hồ sơ thất bại");
          setLoading(false);
          return;
        }

        alert("Đăng ký và cập nhật hồ sơ thành công!");
        setLoading(false);
        onFinish();
        return;
      } catch (error) {
        console.log(error);
        alert("Không thể kết nối server");
        setLoading(false);
        return;
      }
    }

    setErrors({});
    setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) {
      setErrors({});
      setStep(step - 1);
    }
  };

  const progress = ((step + 1) / 8) * 100;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.logo}>
          FITNESS<span style={styles.green}>UT</span>
        </h1>
      </div>

      <div style={styles.card}>
        <div style={styles.progressBg}>
          <div style={{ ...styles.progress, width: `${progress}%` }}></div>
        </div>

        {step === 0 && (
          <div style={styles.content}>
            <h2>Welcome to Fitness AI</h2>
            <p style={styles.desc}>
              Fitness AI sẽ giúp bạn xây dựng kế hoạch tập luyện, dinh dưỡng và
              theo dõi tiến trình cơ thể thông minh hơn!.
            </p>

            <div style={styles.previewGrid}>
              <div style={styles.previewBox}>💪 Workout</div>
              <div style={styles.previewBox}>🍽 Meal</div>
              <div style={styles.previewBox}>📈 BMI</div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={styles.content}>
            <h2>Tên của bạn là gì?</h2>
            <p style={styles.desc}>Tụi mình sẽ cá nhân hóa trải nghiệm cho bạn.</p>

            <label style={styles.fieldLabel}>Tên của bạn</label>

            <input
              style={{ ...styles.input, ...(errors.name ? styles.errorInput : {}) }}
              placeholder="Nhập tên của bạn"
              value={data.name}
              onChange={(e) => updateData("name", e.target.value)}
            />

            {errors.name && <p style={styles.errorText}>Vui lòng nhập tên của bạn</p>}
          </div>
        )}

        {step === 2 && (
          <div style={styles.content}>
            <h2>
              {data.name
                ? `Cảm ơn ${data.name}! Mục tiêu của bạn là gì?`
                : "Mục tiêu của bạn là gì?"}
            </h2>

            <p style={styles.desc}>
              Chọn mục tiêu chính để Fitness AI tạo kế hoạch phù hợp.
            </p>

            <div style={styles.optionList}>
              {goals.map((goal) => (
                <button
                  key={goal}
                  style={{
                    ...styles.option,
                    ...(data.goal === goal ? styles.selected : {}),
                    ...(errors.goal ? styles.errorInput : {}),
                  }}
                  onClick={() => updateData("goal", goal)}
                >
                  {goal}
                </button>
              ))}
            </div>

            {errors.goal && <p style={styles.errorText}>Vui lòng chọn mục tiêu của bạn</p>}
          </div>
        )}

        {step === 3 && (
          <div style={styles.content}>
            <h2>Bạn đang đi đúng hướng rồi!</h2>

            <p style={styles.desc}>
              {goalMessage[data.goal] ||
                "Fitness AI sẽ giúp bạn có một kế hoạch rõ ràng hơn để đạt mục tiêu của mình."}
            </p>

            <p style={styles.quote}>
              “Không cần hoàn hảo ngay từ đầu. Chỉ cần bắt đầu và tiến bộ mỗi ngày.”
            </p>
          </div>
        )}

        {step === 4 && (
          <div style={styles.content}>
            <h2>Mức độ hoạt động hằng ngày của bạn?</h2>

            <p style={styles.desc}>Không tính các buổi tập gym riêng.</p>

            <div style={styles.optionList}>
              {activities.map((item) => (
                <button
                  key={item.title}
                  style={{
                    ...styles.option,
                    textAlign: "left",
                    ...(data.activity === item.title ? styles.selected : {}),
                    ...(errors.activity ? styles.errorInput : {}),
                  }}
                  onClick={() => updateData("activity", item.title)}
                >
                  <b>{item.title}</b>
                  <br />
                  <span style={styles.small}>{item.desc}</span>
                </button>
              ))}
            </div>

            {errors.activity && <p style={styles.errorText}>Vui lòng chọn mức độ hoạt động</p>}
          </div>
        )}

        {step === 5 && (
          <div style={styles.content}>
            <h2>Thông tin cơ thể của bạn</h2>

            <p style={styles.desc}>Fitness AI sẽ dùng thông tin này để tính BMI.</p>

            <label style={styles.fieldLabel}>Ngày sinh</label>
            <input
              style={{
                ...styles.input,
                ...(errors.birthDate ? styles.errorInput : {}),
              }}
              type="date"
              value={data.birthDate}
              onChange={(e) => updateData("birthDate", e.target.value)}
            />
            {errors.birthDate && <p style={styles.errorText}>Vui lòng chọn ngày sinh</p>}

            <label style={styles.fieldLabel}>Giới tính</label>
            <select
              style={{
                ...styles.input,
                ...(errors.gender ? styles.errorInput : {}),
              }}
              value={data.gender}
              onChange={(e) => updateData("gender", e.target.value)}
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            {errors.gender && <p style={styles.errorText}>Vui lòng chọn giới tính</p>}

            <label style={styles.fieldLabel}>Chiều cao</label>
            <input
              style={{
                ...styles.input,
                ...(errors.height ? styles.errorInput : {}),
              }}
              type="number"
              placeholder="Ví dụ: 170 cm"
              value={data.height}
              onChange={(e) => updateData("height", e.target.value)}
            />
            {errors.height && <p style={styles.errorText}>Vui lòng nhập chiều cao</p>}

            <label style={styles.fieldLabel}>Cân nặng</label>
            <input
              style={{
                ...styles.input,
                ...(errors.weight ? styles.errorInput : {}),
              }}
              type="number"
              placeholder="Ví dụ: 60 kg"
              value={data.weight}
              onChange={(e) => updateData("weight", e.target.value)}
            />
            {errors.weight && <p style={styles.errorText}>Vui lòng nhập cân nặng</p>}

            {bmi && (
              <div style={styles.bmiBox}>
                BMI của bạn: <b>{bmi}</b>
              </div>
            )}
          </div>
        )}

        {step === 6 && (
          <div style={styles.content}>
            <h2>Bạn muốn tập ở đâu?</h2>

            <p style={styles.desc}>Chọn nơi tập để Fitness AI tạo lịch phù hợp.</p>

            <div style={styles.optionList}>
              <button
                style={{
                  ...styles.option,
                  ...(data.workoutPlace === "home" ? styles.selected : {}),
                  ...(errors.workoutPlace ? styles.errorInput : {}),
                }}
                onClick={() => updateData("workoutPlace", "home")}
              >
                Tập ở nhà
              </button>

              <button
                style={{
                  ...styles.option,
                  ...(data.workoutPlace === "gym" ? styles.selected : {}),
                  ...(errors.workoutPlace ? styles.errorInput : {}),
                }}
                onClick={() => updateData("workoutPlace", "gym")}
              >
                Tập ở phòng gym
              </button>
            </div>

            {errors.workoutPlace && <p style={styles.errorText}>Vui lòng chọn nơi tập</p>}

            {data.workoutPlace === "gym" && (
              <>
                <label style={styles.fieldLabel}>
                  Bạn có thể đến phòng gym bao nhiêu ngày một tuần?
                </label>

                <select
                  style={{
                    ...styles.input,
                    ...(errors.gymDays ? styles.errorInput : {}),
                  }}
                  value={data.gymDays}
                  onChange={(e) => updateData("gymDays", e.target.value)}
                >
                  <option value="">Chọn số ngày</option>
                  <option value="1">1 lần/tuần</option>
                  <option value="2">2 lần/tuần</option>
                  <option value="3">3 lần/tuần</option>
                  <option value="4">4 lần/tuần</option>
                  <option value="5">5 lần/tuần</option>
                  <option value="6">6 lần/tuần</option>
                  <option value="7">7 lần/tuần</option>
                </select>

                {errors.gymDays && (
                  <p style={styles.errorText}>
                    Vui lòng chọn số ngày có thể đến phòng gym
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {step === 7 && (
          <div style={styles.content}>
            <h2>Almost there! Create your account.</h2>

            <p style={styles.desc}>Tạo tài khoản để lưu kế hoạch cá nhân của bạn.</p>

            <label style={styles.fieldLabel}>Email</label>
            <input
              style={{ ...styles.input, ...(errors.email ? styles.errorInput : {}) }}
              type="email"
              placeholder="Email address"
              value={data.email}
              onChange={(e) => updateData("email", e.target.value)}
            />
            {errors.email && <p style={styles.errorText}>Vui lòng nhập email</p>}

            <label style={styles.fieldLabel}>Số điện thoại</label>
            <input
              style={{ ...styles.input, ...(errors.phone ? styles.errorInput : {}) }}
              type="text"
              placeholder="Số điện thoại 10 chữ số"
              value={data.phone}
              onChange={(e) => updateData("phone", e.target.value)}
            />
            {errors.phone && <p style={styles.errorText}>Số điện thoại phải đủ 10 số</p>}

            <label style={styles.fieldLabel}>Mật khẩu</label>
            <div
              style={{
                ...styles.passwordBox,
                ...(errors.password ? styles.errorInput : {}),
              }}
            >
              <input
                style={styles.passwordInput}
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={data.password}
                onChange={(e) => updateData("password", e.target.value)}
              />

              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {errors.password && (
              <p style={styles.errorText}>Mật khẩu phải có ít nhất 8 ký tự</p>
            )}

            <p style={styles.passwordNote}>Must be at least 8 characters.</p>

            <button style={styles.googleBtn}>
              <span style={styles.googleIcon}>G</span>
              Continue with Google
            </button>
          </div>
        )}

        <div style={styles.actions}>
          <button
            style={{
              ...styles.backBtn,
              ...(step === 0 || loading ? styles.disabledBtn : {}),
            }}
            onClick={prevStep}
            disabled={step === 0 || loading}
          >
            BACK
          </button>

          <button
            style={{
              ...styles.nextBtn,
              ...(loading ? styles.disabledBtn : {}),
            }}
            onClick={nextStep}
            disabled={loading}
          >
            {loading ? "ĐANG XỬ LÝ..." : step === 7 ? "HOÀN TẤT" : "NEXT"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    height: "74px",
    display: "flex",
    alignItems: "center",
    padding: "0 70px",
    boxShadow: "0 2px 18px rgba(0,0,0,0.06)",
    background: "white",
  },

  logo: {
    fontSize: "34px",
    color: "#111827",
  },

  green: {
    color: "#84cc16",
  },

  card: {
    width: "720px",
    minHeight: "720px",
    margin: "40px auto",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
    overflow: "hidden",
    position: "relative",
  },

  progressBg: {
    width: "100%",
    height: "10px",
    background: "#d1d5db",
  },

  progress: {
    height: "100%",
    background: "#0b74f1",
    transition: "0.3s",
  },

  content: {
    padding: "55px 70px 130px",
    textAlign: "center",
  },

  desc: {
    fontSize: "20px",
    lineHeight: "1.5",
    color: "#374151",
    marginBottom: "32px",
  },

  fieldLabel: {
    display: "block",
    textAlign: "left",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#111827",
  },

  input: {
    width: "100%",
    padding: "18px",
    fontSize: "20px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    marginBottom: "18px",
    boxSizing: "border-box",
  },

  errorInput: {
    border: "2px solid #ef4444",
  },

  errorText: {
    color: "#ef4444",
    fontSize: "14px",
    textAlign: "left",
    marginTop: "-10px",
    marginBottom: "14px",
  },

  optionList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  option: {
    width: "100%",
    padding: "20px",
    fontSize: "20px",
    border: "2px solid #d1d5db",
    borderRadius: "6px",
    background: "white",
    cursor: "pointer",
  },

  selected: {
    borderColor: "#0b74f1",
    color: "#0b74f1",
    fontWeight: "bold",
  },

  small: {
    fontSize: "16px",
    color: "#6b7280",
  },

  quote: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#0b74f1",
    lineHeight: "1.6",
  },

  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },

  previewBox: {
    padding: "30px",
    borderRadius: "16px",
    background: "#eff6ff",
    fontWeight: "bold",
    color: "#0b74f1",
  },

  bmiBox: {
    marginTop: "12px",
    padding: "18px",
    borderRadius: "8px",
    background: "#eff6ff",
    color: "#0b74f1",
    fontSize: "22px",
  },

  passwordBox: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    marginBottom: "10px",
    boxSizing: "border-box",
  },

  passwordInput: {
    flex: 1,
    padding: "18px",
    fontSize: "20px",
    border: "none",
    outline: "none",
  },

  eyeBtn: {
    width: "60px",
    border: "none",
    background: "transparent",
    fontSize: "22px",
    cursor: "pointer",
  },

  passwordNote: {
    textAlign: "left",
    color: "#6b7280",
    marginBottom: "22px",
  },

  googleBtn: {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "6px",
    background: "#e5e7eb",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
  },

  googleIcon: {
    color: "#0b74f1",
    fontWeight: "bold",
  },

  actions: {
    position: "absolute",
    bottom: "50px",
    left: "70px",
    right: "70px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  backBtn: {
    padding: "20px",
    border: "2px solid #0b74f1",
    background: "white",
    color: "#0b74f1",
    fontSize: "20px",
    fontWeight: "bold",
    borderRadius: "6px",
    cursor: "pointer",
  },

  disabledBtn: {
    opacity: 0.4,
    cursor: "not-allowed",
  },

  nextBtn: {
    padding: "20px",
    border: "none",
    background: "#0b74f1",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Onboarding;