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
    <div className={`${backgroundStyle}`}>
      <div
        className={`w-96 flex items-center justify-center rounded-lg shadow-md bg-secondary ${inputWrapperStyle}`}
      >
        <input
          type={type} // Use the type prop
          className={`flex-1 items-center justify-center text-lg p-1 pl-4 bg-secondary rounded-lg ${inputStyle} placeholder:text-primary placeholder:opacity-50 focus:outline-none`}
          placeholder={placeholder}
          value={term}
          onChange={type === "file" ? handleFileChange : onChangeText}
          onKeyPress={(e) => e.key === "Enter" && onSubmitEditing()}
          disabled={!editable}
          multiple={multiple} // Add this line to allow multiple file selection
        />
        {iconName && (
          <button onClick={onIconPress} className="p-2 pr-4 cursor-pointer">
            <i
              className={`fa fa-${iconName} text-${iconSize} text-primary ${iconStyle}`}
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
