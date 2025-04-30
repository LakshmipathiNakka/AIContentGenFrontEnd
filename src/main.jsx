// src/index.js (or src/main.jsx if using Vite)
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";  // Make sure Tailwind's CSS is imported here
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
