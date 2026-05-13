import { useState } from "react";

import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";

function App() {

  const [page, setPage] =
    useState("landing");

  return (
    <>

      {page === "landing" && (
        <Landing
          onStart={() =>
            setPage("onboarding")
          }
        />
      )}

      {page === "onboarding" && (
        <Onboarding
          onFinish={() =>
            setPage("home")
          }
        />
      )}

      {page === "home" && (
        <Home />
      )}

    </>
  );
}

export default App;