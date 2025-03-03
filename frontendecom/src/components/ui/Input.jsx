// src/components/ui/Input.jsx
import React from "react";

const Input = ({ type = "text", placeholder, value, onChange, className }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border rounded-lg p-2 w-full outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export default Input;
