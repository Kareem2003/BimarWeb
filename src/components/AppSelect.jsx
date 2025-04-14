import React from "react";
import "font-awesome/css/font-awesome.min.css";

const AppSelect = ({
  selectedValue,
  onChange,
  options = [],
  placeholder = "",
  selectWrapperStyle = "",
  backgroundStyle = "",
  selectStyle = "",
  validationText = "",
  name = "",
  editable = true,
}) => {
  return (
    <div className={`w-full flex flex-col items-center ${backgroundStyle}`}>
      <div
        className={`w-[90%] flex items-center justify-center rounded-3xl shadow-md bg-white/10 ${selectWrapperStyle}`}
      >
        <select
          name={name}
          value={selectedValue || ""}
          onChange={onChange}
          className={`w-full p-2 pl-5 text-lg bg-white/10 rounded-3xl ${selectStyle} text-white focus:outline-none ${
            !editable ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!editable}
        >
          <option value="" disabled className="text-white bg-gray-800">
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-black bg-gray-800"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {validationText && (
        <p className="mt-1 text-xs text-red-600 opacity-80 text-right w-[90%]">
          {validationText}
        </p>
      )}
    </div>
  );
};

export default AppSelect;
