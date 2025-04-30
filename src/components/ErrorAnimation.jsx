// src/components/ErrorAnimation.jsx
import { motion } from "framer-motion";

function ErrorAnimation() {
  return (
    <motion.div
      className="bg-red-500 text-white p-2 mb-4 rounded"
      animate={{ x: [0, 10, -10, 10, -10, 0] }}
      transition={{ repeat: 1, duration: 0.5 }}
    >
      Incorrect Username or Password
    </motion.div>
  );
}

export default ErrorAnimation;
