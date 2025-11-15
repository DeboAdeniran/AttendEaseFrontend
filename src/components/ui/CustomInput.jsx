import React from "react";

export const CustomInput = ({
  placeholder,
  onChange,
  type,
  name,
  required,
  value,
  readOnly,
}) => {
  return (
    <input
      readOnly={readOnly}
      value={value}
      placeholder={placeholder}
      name={name}
      type={type}
      className="w-full border-2 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors"
      style={{
        backgroundColor: "rgba(8, 8, 8, 0.5)",
        borderColor: "rgba(51, 84, 244, 0.5)",
        caretColor: "#3354f4",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#3354f4")}
      onBlur={(e) =>
        (e.currentTarget.style.borderColor = "rgba(51, 84, 244, 0.5)")
      }
      required={required}
      onChange={onChange}
    />
  );
};
