import { useState } from "react";
import { Send, Bot, User, ArrowLeft } from "lucide-react";

export default function AICoach({ onNavigate, onLogout }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I’m your AI Coach. Tell me your fitness goal, BMI, weight, or meal problem. I will help you.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: input,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
  const res = await fetch("https://fitness-ai-app-71hw.onrender.com/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: input,
    }),
  });

  const data = await res.json();

  setMessages((prev) => [
    ...prev,
    {
      role: "ai",
      text: data.reply,
    },
  ]);
} catch (error) {
  setMessages((prev) => [
    ...prev,
    {
      role: "ai",
      text: "AI server error.",
    },
  ]);
}

setLoading(false);
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
              Dashboard
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("workout")}>
              Workout
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("meal")}>
              Meal Plan
            </div>

            <div style={styles.menuItem} onClick={() => onNavigate("progress")}>
              Progress
            </div>

            <div style={styles.activeMenu}>
              AI Coach
            </div>
            <div
              style={styles.menuItem}
              onClick={() => onNavigate("profile")}
            >
              Profile
            </div>
          </div>
        </div>

        <div style={styles.logout} onClick={onLogout}>
          Logout
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>AI Coach </h1>
            <p style={styles.subtitle}>
              Ask your personal fitness AI assistant
            </p>
          </div>

          <button style={styles.backBtn} onClick={() => onNavigate("home")}>
            <ArrowLeft size={18} />
            Back Home
          </button>
        </div>

        <div style={styles.chatBox}>
          <div style={styles.chatHeader}>
            <div style={styles.botIcon}>
              <Bot size={28} />
            </div>

            <div>
              <h2 style={styles.chatTitle}>Fitness AI Assistant</h2>
              <p style={styles.chatSub}>Workout • Meal • BMI • Progress</p>
            </div>
          </div>

          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageRow,
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.role === "ai" && (
                  <div style={styles.aiAvatar}>
                    <Bot size={18} />
                  </div>
                )}

                <div
                  style={{
                    ...styles.bubble,
                    ...(msg.role === "user"
                      ? styles.userBubble
                      : styles.aiBubble),
                  }}
                >
                  {msg.text}
                </div>

                {msg.role === "user" && (
                  <div style={styles.userAvatar}>
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={styles.messageRow}>
                <div style={styles.aiAvatar}>
                  <Bot size={18} />
                </div>

                <div style={styles.aiBubble}>AI is thinking...</div>
              </div>
            )}
          </div>

          <div style={styles.inputArea}>
            <input
              style={styles.input}
              placeholder="Ask your AI coach..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button style={styles.sendBtn} onClick={handleSend}>
              <Send size={20} />
            </button>
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
  width: "calc(100% - 320px)",
  boxSizing: "border-box",
},

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    fontSize: "38px",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: "10px",
  },

  backBtn: {
    background: "#1f2937",
    color: "white",
    border: "1px solid rgba(132,204,22,0.3)",
    padding: "14px 20px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },

  chatBox: {
    height: "75vh",
    background: "#111827",
    borderRadius: "28px",
    border: "1px solid rgba(132,204,22,0.25)",
    boxShadow: "0 0 30px rgba(132,204,22,0.08)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  chatHeader: {
    padding: "25px 30px",
    background: "linear-gradient(90deg,#111827,#1e293b)",
    borderBottom: "1px solid #1f2937",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  botIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    background: "#84cc16",
    color: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 0 25px rgba(132,204,22,0.5)",
  },

  chatTitle: {
    margin: 0,
    color: "#84cc16",
  },

  chatSub: {
    margin: "6px 0 0",
    color: "#94a3b8",
  },

  messages: {
    flex: 1,
    padding: "30px",
    overflowY: "auto",
    background: "#0f172a",
  },

  messageRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "20px",
  },

  aiAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#84cc16",
    color: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  userAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#1f2937",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  bubble: {
    maxWidth: "70%",
    padding: "16px 18px",
    borderRadius: "18px",
    lineHeight: "1.6",
    fontSize: "15px",
  },

  aiBubble: {
    background: "#111827",
    color: "#e5e7eb",
    border: "1px solid #1f2937",
  },

  userBubble: {
    background: "linear-gradient(90deg,#84cc16,#65a30d)",
    color: "#0f172a",
    fontWeight: "bold",
  },

  inputArea: {
    padding: "22px",
    background: "#111827",
    borderTop: "1px solid #1f2937",
    display: "flex",
    gap: "14px",
  },

  input: {
    flex: 1,
    background: "#0f172a",
    border: "1px solid #1f2937",
    color: "white",
    padding: "16px 20px",
    borderRadius: "16px",
    outline: "none",
    fontSize: "15px",
  },

  sendBtn: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    border: "none",
    background: "#84cc16",
    color: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
};