// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import InputField from "../components/InputField";
import Button from "../components/Button";
import ErrorAnimation from "../components/ErrorAnimation";
import useAuth from "../hooks/useAuth";

function LoginPage() {
  const { validateCredentials } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateCredentials(username, password)) {
      alert("Login successful!");
    } else {
      setIsError(true);
    }
  };

  return (
    <motion.div
      className="w-full max-w-sm p-8 bg-glass rounded-3xl shadow-3d relative"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
      {isError && <ErrorAnimation />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button text="Login" onClick={handleSubmit} />
      </form>
    </motion.div>
  );
}

export default LoginPage;
