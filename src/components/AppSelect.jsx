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
    <div className={`${backgroundStyle}`}>
      <div
        className={`w-96 flex items-center justify-center rounded-lg shadow-md bg-secondary ${selectWrapperStyle}`}
      >
        <select
          name={name}
          value={selectedValue}
          onChange={onChange}
          className={`flex-1 items-center justify-center text-lg p-1 pl-4 bg-secondary rounded-lg ${selectStyle} text-primary focus:outline-none`}
          disabled={!editable}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-primary"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {validationText && (
        <p className="mt-1 text-xs text-red-600 opacity-80 text-right">
          {validationText}
        </p>
      )}
    </div>
  );
};

export default AppSelect;
