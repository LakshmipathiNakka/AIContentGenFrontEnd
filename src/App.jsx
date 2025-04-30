// src/App.jsx
import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-dark text-light" : "bg-light text-dark"
      } flex justify-center items-center relative`}
    >
      <button
        className="absolute top-4 right-4 p-2 bg-gray-500 rounded-full"
        onClick={toggleDarkMode}
      >
        Toggle Dark Mode
      </button>

      {/* Floating Code Icons */}
      <div className="floating-icons">
        <span style={{ "--i": 1 }}>{"</>"}</span>
        <span style={{ "--i": 2 }}>{"{}"}</span>
        <span style={{ "--i": 3 }}>{"()"}</span>
      </div>

      <LoginPage />
    </div>
  );
}

export default App;
