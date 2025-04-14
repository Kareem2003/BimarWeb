import React, { useState } from "react";
import "font-awesome/css/font-awesome.min.css";

const AppInput = ({
  term,
  onChangeText,
  onSubmitEditing,
  secureTextEntry = false,
  iconName,
  onIconPress,
  placeholder = "",
  inputWrapperStyle = "",
  backgroundStyle = "",
  inputStyle = "",
  iconStyle = "",
  validationText = "",
  iconSize = 20,
  keyboardType = "text", // Default to "text"
  editable = true,
  type = "text", // Add a type prop for input type
  multiple = false, // Add a prop to handle multiple file selection
}) => {
  const [filePreviews, setFilePreviews] = useState([]); // State for file previews

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFilePreviews(files.map((file) => URL.createObjectURL(file)));
    onChangeText(e);
  };

  return (
    <div className={`w-full flex flex-col items-center ${backgroundStyle}`}>
      <div
        className={`w-[90%] flex items-center justify-center rounded-3xl shadow-md bg-white/10 ${inputWrapperStyle}`}
      >
        <input
          type={type}
          className={`w-full p-2 pl-5 text-lg bg-white/10 rounded-3xl ${inputStyle} placeholder:text-white placeholder:opacity-80 focus:outline-none text-white`}
          placeholder={placeholder}
          value={term}
          onChange={type === "file" ? handleFileChange : onChangeText}
          onKeyPress={(e) => e.key === "Enter" && onSubmitEditing()}
          disabled={!editable}
          multiple={multiple}
        />
        {iconName && (
          <button onClick={onIconPress} className="absolute right-[20%] p-2 cursor-pointer">
            <i
              className={`fa fa-${iconName} text-${iconSize} text-white hover:text-tertiary ${iconStyle}`}
            />
          </button>
        )}
      </div>
      {validationText && (
        <p className="mt-1 text-xs text-red-600 opacity-80 text-right">
          {validationText}
        </p>
      )}
      {/* Preview Section */}
      {type === "file" && (
        <div className="mt-2 flex flex-wrap">
          {filePreviews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`preview-${index}`}
              className="w-20 h-20 object-cover rounded-lg mr-2 mb-2"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppInput;
