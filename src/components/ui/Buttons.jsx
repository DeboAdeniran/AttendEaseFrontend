/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

export const AccessRoleButton = ({ children, className, onClick }) => {
  return (
    <motion.button
      className={`${className} text-blue shadow-blue hover:shadow-lg shadow-md p-15 rounded-lg cursor-pointer select-none bg-glass-black`}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export const SubmitButton = ({ onClick, name }) => {
  return (
    <motion.button
      className="w-full h-full bg-button p-2 rounded-2xl"
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
    >
      <motion.div transition={{ duration: 0.3 }}>{name}</motion.div>
    </motion.button>
  );
};
const Buttons = {
  AccessRoleButton,
  SubmitButton,
};

export default Buttons;
