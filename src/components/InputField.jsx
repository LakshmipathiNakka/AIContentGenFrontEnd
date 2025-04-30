// src/components/InputField.jsx
import { motion } from "framer-motion";

function InputField({ label, type, value, onChange }) {
  return (
    <div className="relative mb-6">
      <motion.input
        type={type}
        value={value}
        onChange={onChange}
        className="peer w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
      <label className="absolute left-3 top-0 text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs">
        {label}
      </label>
    </div>
  );
}

export default InputField;
