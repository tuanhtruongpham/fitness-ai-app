import { useState } from "react";

import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
function App() {
  const [page, setPage] = useState("landing");

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
        />
      )}

      {page === "login" && (
        <Login
          onBack={() => setPage("landing")}
          onLoginSuccess={() => setPage("home")}
        />
      )}
{page === "workout" && (
  <Workout
    onNavigate={(targetPage) => setPage(targetPage)}
    onLogout={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setPage("landing");
    }}
  />
)}
      {page === "home" && (
  <Home
    onNavigate={(targetPage) => setPage(targetPage)}
    onLogout={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setPage("landing");
    }}
  />
)}
    </>
  );
}

export default App;