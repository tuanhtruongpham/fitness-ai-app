import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="914531240017-61bh5l27ad2mmqu2g52o8l0gqqfi1s99.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);