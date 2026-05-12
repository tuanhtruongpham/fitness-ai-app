import { useState } from "react";
import Home from "./Home";

import googleLogo from "../assets/google.png";
import bgPage from "../assets/back.png";
import gymBg from "../assets/back1.png";

function Login() {

  const [isRegister, setIsRegister] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);

  // NẾU LOGIN THÀNH CÔNG
  if (loggedIn) {
    return <Home />;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* LEFT SIDE */}
        <div style={styles.left}>

          <h1 style={styles.title}>
            BIẾN <span style={styles.green}>MỤC TIÊU</span>
            <br />
            THÀNH CƠ THỂ
            <br />
            <span style={styles.green}>MƠ ƯỚC</span>
          </h1>

          <p style={styles.desc}>
            Fitness AI đồng hành cùng bạn lập kế hoạch tập luyện,
            dinh dưỡng và theo dõi tiến trình một cách thông minh.
          </p>

          <div style={styles.feature}>
            <div style={styles.icon}>📈</div>

            <div>
              <h3 style={styles.featureTitle}>
                Kế hoạch cá nhân hóa
              </h3>

              <p style={styles.featureText}>
                AI tạo kế hoạch phù hợp với bạn
              </p>
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.icon}>🍽️</div>

            <div>
              <h3 style={styles.featureTitle}>
                Dinh dưỡng thông minh
              </h3>

              <p style={styles.featureText}>
                Gợi ý thực đơn và theo dõi calories
              </p>
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.icon}>💪</div>

            <div>
              <h3 style={styles.featureTitle}>
                Theo dõi tiến trình
              </h3>

              <p style={styles.featureText}>
                Thống kê BMI, cân nặng và hiệu quả
              </p>
            </div>
          </div>

        </div>

        {/* CARD */}
        <div style={styles.card}>

          <div style={styles.logo}>💪</div>

          <h2 style={styles.appName}>
            FITNESS <span style={styles.green}>AI</span>
          </h2>

          <p style={styles.sub}>
            Huấn luyện viên AI của bạn
          </p>

          <h2 style={styles.welcome}>
            {isRegister
              ? "Tạo tài khoản 🚀"
              : "Chào mừng trở lại 👋"}
          </h2>

          <p style={styles.loginText}>
            {isRegister
              ? "Đăng ký để bắt đầu hành trình fitness"
              : "Đăng nhập để tiếp tục hành trình của bạn"}
          </p>

          {/* FULLNAME */}
          {isRegister && (
            <>
              <label style={styles.label}>
                Họ và tên
              </label>

              <input
                style={styles.input}
                type="text"
                placeholder="Nhập họ và tên"
              />
            </>
          )}

          {/* EMAIL */}
          <label style={styles.label}>
            Email
          </label>

          <input
            style={styles.input}
            type="email"
            placeholder="Nhập email của bạn"
          />

          {/* PHONE */}
          {isRegister && (
            <>
              <label style={styles.label}>
                Số điện thoại
              </label>

              <input
                style={styles.input}
                type="text"
                placeholder="Nhập số điện thoại"
              />
            </>
          )}

          {/* PASSWORD */}
          <label style={styles.label}>
            Mật khẩu
          </label>

          <input
            style={styles.input}
            type="password"
            placeholder="Nhập mật khẩu của bạn"
          />

          {/* LOGIN OPTIONS */}
          {!isRegister && (
            <div style={styles.row}>

              <label style={styles.checkbox}>
                <input type="checkbox" />
                {" "}Ghi nhớ đăng nhập
              </label>

              <span style={styles.link}>
                Quên mật khẩu?
              </span>

            </div>
          )}

          {/* BUTTON */}
          <button
            style={styles.button}

            onClick={() => {

              // LOGIN
              if (!isRegister) {
                setLoggedIn(true);
              }

              // REGISTER
              else {
                alert("Đăng ký thành công 😭");
                setIsRegister(false);
              }

            }}
          >
            {isRegister
              ? "Đăng ký"
              : "Đăng nhập"}
          </button>

          {/* DIVIDER */}
          <div style={styles.divider}>

            <span style={styles.line}></span>

            <p>HOẶC</p>

            <span style={styles.line}></span>

          </div>

          {/* GOOGLE */}
          <button style={styles.google}>

            <img
              src={googleLogo}
              alt="google"
              style={styles.googleIcon}
            />

            <span>
              Đăng nhập với Google
            </span>

          </button>

          {/* REGISTER SWITCH */}
          <p style={styles.register}>

            {isRegister
              ? "Đã có tài khoản? "
              : "Chưa có tài khoản? "}

            <span
              style={{
                ...styles.green,
                cursor: "pointer",
                fontWeight: "bold",
              }}

              onClick={() =>
                setIsRegister(!isRegister)
              }
            >
              {isRegister
                ? "Đăng nhập"
                : "Đăng ký ngay"}
            </span>

          </p>

        </div>
      </div>
    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",

    backgroundImage: `linear-gradient(
      rgba(0,0,0,0.8),
      rgba(0,0,0,0.8)
    ), url(${bgPage})`,

    backgroundSize: "cover",

    backgroundPosition: "center",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontFamily: "'Times New Roman', serif",

    color: "white",
  },

  container: {
    width: "1100px",

    minHeight: "650px",

    backgroundImage: `linear-gradient(
      rgba(0,0,0,0.7),
      rgba(0,0,0,0.7)
    ), url(${gymBg})`,

    backgroundSize: "cover",

    backgroundPosition: "center",

    display: "grid",

    gridTemplateColumns: "1fr 480px",

    gap: "40px",

    padding: "40px",

    border: "1px solid rgba(132, 204, 22, 0.4)",

    borderRadius: "28px",

    boxShadow: "0 0 60px rgba(132, 204, 22, 0.18)",
  },

  left: {
    padding: "40px 20px",
  },

  title: {
    fontSize: "46px",

    lineHeight: "1.2",

    fontWeight: "900",

    marginBottom: "30px",
  },

  green: {
    color: "#84cc16",
  },

  desc: {
    width: "430px",

    color: "#d1d5db",

    fontSize: "17px",

    lineHeight: "1.7",

    marginBottom: "50px",
  },

  feature: {
    display: "flex",

    gap: "18px",

    alignItems: "center",

    marginBottom: "28px",
  },

  icon: {
    width: "55px",

    height: "55px",

    border: "1px solid #84cc16",

    borderRadius: "12px",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontSize: "26px",

    background: "rgba(132, 204, 22, 0.08)",
  },

  featureTitle: {
    margin: 0,

    color: "#84cc16",

    fontSize: "17px",
  },

  featureText: {
    margin: "6px 0 0",

    color: "#d1d5db",

    fontSize: "14px",
  },

  card: {
    background: "rgba(17, 24, 39, 0.95)",

    borderRadius: "24px",

    padding: "42px",

    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },

  logo: {
    textAlign: "center",

    fontSize: "48px",
  },

  appName: {
    textAlign: "center",

    fontSize: "32px",

    margin: "10px 0 0",
  },

  sub: {
    textAlign: "center",

    color: "#9ca3af",

    marginBottom: "35px",
  },

  welcome: {
    textAlign: "center",

    fontSize: "26px",
  },

  loginText: {
    textAlign: "center",

    color: "#9ca3af",

    marginBottom: "30px",
  },

  label: {
    display: "block",

    marginBottom: "8px",

    fontWeight: "bold",
  },

  input: {
    width: "100%",

    padding: "15px",

    marginBottom: "18px",

    borderRadius: "10px",

    border: "1px solid #374151",

    background: "#1f2937",

    color: "white",

    fontSize: "15px",

    boxSizing: "border-box",
  },

  row: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    fontSize: "14px",

    marginBottom: "25px",
  },

  checkbox: {
    color: "#d1d5db",
  },

  link: {
    color: "#84cc16",

    cursor: "pointer",
  },

  button: {
    width: "100%",

    padding: "15px",

    borderRadius: "10px",

    border: "none",

    background:
      "linear-gradient(90deg, #84cc16, #65a30d)",

    color: "white",

    fontWeight: "bold",

    fontSize: "17px",

    cursor: "pointer",
  },

  divider: {
    display: "flex",

    alignItems: "center",

    gap: "15px",

    color: "#9ca3af",

    margin: "25px 0",
  },

  line: {
    flex: 1,

    height: "1px",

    background: "#374151",
  },

  google: {
    width: "100%",

    padding: "14px",

    borderRadius: "10px",

    border: "1px solid #4b5563",

    background: "transparent",

    color: "white",

    fontWeight: "bold",

    fontSize: "15px",

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",
  },

  googleIcon: {
    width: "20px",
    height: "20px",
  },

  register: {
    textAlign: "center",

    color: "#d1d5db",

    marginTop: "25px",
  },
};

export default Login;