// src/components/Button.jsx
import { motion } from "framer-motion";

function Button({ text, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {text}
    </motion.button>
  );
}

export default Button;
