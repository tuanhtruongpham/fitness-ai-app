import { useState } from "react";

function Login({ onLoginSuccess, onBack }) {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const updateData = (field, value) => {
    setData({
      ...data,
      [field]: value,
    });

    setErrors({
      ...errors,
      [field]: false,
    });
  };

  const handleLogin = async () => {
    const newErrors = {};

    if (!data.email.trim()) newErrors.email = true;
    if (!data.password || data.password.length < 8) newErrors.password = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Đăng nhập thất bại");
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      alert("Đăng nhập thành công!");

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      alert("Không thể kết nối backend");
      console.log(error);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.logo}>
          FITNESS<span style={styles.green}>UT</span>
        </h1>
      </div>

      <div style={styles.card}>
        <div style={styles.content}>
          <h2 style={styles.title}>Welcome back!</h2>

          <p style={styles.desc}>
            Đăng nhập để tiếp tục theo dõi kế hoạch tập luyện và dinh dưỡng của bạn.
          </p>

          <label style={styles.fieldLabel}>Email hoặc số điện thoại</label>
          <input
            style={{
              ...styles.input,
              ...(errors.email ? styles.errorInput : {}),
            }}
            type="text"
            placeholder="Nhập email hoặc số điện thoại"
            value={data.email}
            onChange={(e) => updateData("email", e.target.value)}
          />

          {errors.email && (
            <p style={styles.errorText}>Vui lòng nhập email hoặc số điện thoại</p>
          )}

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
              placeholder="Nhập mật khẩu"
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

          <p style={styles.forgot}>Forgot password?</p>

          <button style={styles.loginBtn} onClick={handleLogin}>
            ĐĂNG NHẬP
          </button>

          <div style={styles.divider}>
            <span style={styles.line}></span>
            <span style={styles.or}>OR</span>
            <span style={styles.line}></span>
          </div>

          <button style={styles.googleBtn}>
            <span style={styles.googleIcon}>G</span>
            Continue with Google
          </button>

          <button style={styles.backBtn} onClick={onBack}>
            ← Quay lại trang chủ
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
    width: "520px",
    margin: "60px auto",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },

  content: {
    padding: "50px",
    textAlign: "center",
  },

  title: {
    fontSize: "34px",
    marginBottom: "12px",
    color: "#111827",
  },

  desc: {
    fontSize: "18px",
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
    fontSize: "18px",
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
    fontSize: "18px",
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

  forgot: {
    textAlign: "right",
    color: "#0b74f1",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "24px",
  },

  loginBtn: {
    width: "100%",
    padding: "18px",
    border: "none",
    background: "#0b74f1",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "6px",
    cursor: "pointer",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "28px 0",
  },

  line: {
    flex: 1,
    height: "1px",
    background: "#d1d5db",
  },

  or: {
    color: "#6b7280",
    fontWeight: "bold",
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

  backBtn: {
    marginTop: "24px",
    border: "none",
    background: "transparent",
    color: "#6b7280",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Login;