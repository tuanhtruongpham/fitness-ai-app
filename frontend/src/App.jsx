import { useEffect, useState } from "react";

import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";

import Home from "./pages/Home";
import Workout from "./pages/Workout";
import Meal from "./pages/Meal";
import Progress from "./pages/Progress";
import AICoach from "./pages/AICoach";

function App() {
  const [page, setPage] = useState("landing");

  useEffect(() => {
  const checkLogin = () => {
    const token = localStorage.getItem("token");

    if (token) {
      setPage("home");
    } else {
      setPage("landing");
    }
  };

  checkLogin();

  window.addEventListener("storage", checkLogin);

  return () => {
    window.removeEventListener("storage", checkLogin);
  };
}, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("needProfile");

    setPage("landing");
  };

  return (
    <>
      {page === "landing" && (
        <Landing
          onStart={() => setPage("onboarding")}
          onLogin={() => setPage("login")}
        />
      )}

      {page === "onboarding" && (
        <Onboarding
          onFinish={() => setPage("home")}
          onBack={() => setPage("landing")}
        />
      )}

      {page === "login" && (
        <Login
          onBack={() => setPage("landing")}
          onLoginSuccess={() => setPage("home")}
        />
      )}

      {page === "home" && (
        <Home
          onNavigate={(targetPage) => setPage(targetPage)}
          onLogout={logout}
        />
      )}

      {page === "workout" && (
        <Workout
          onNavigate={(targetPage) => setPage(targetPage)}
          onLogout={logout}
        />
      )}

      {page === "meal" && (
        <Meal
          onNavigate={(targetPage) => setPage(targetPage)}
          onLogout={logout}
        />
      )}

      {page === "progress" && (
        <Progress
          onNavigate={(targetPage) => setPage(targetPage)}
          onLogout={logout}
        />
      )}

      {page === "ai-coach" && (
        <AICoach
          onNavigate={(targetPage) => setPage(targetPage)}
          onLogout={logout}
        />
      )}
    </>
  );
}

export default App;