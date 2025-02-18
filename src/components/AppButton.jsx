import React from "react";

const AppButton = ({ title, onPress, buttonStyle = "", textStyle = "" }) => {
  return (
    <button
      className={`bg-primary rounded-lg py-2 px-10 flex justify-center items-center cursor-pointer ${buttonStyle}`}
      onClick={onPress}
    >
      <span
        className={`text-center text-xl font-bold uppercase italic text-white ${textStyle}`}
      >
        {title}
      </span>
    </button>
  );
};

export default AppButton;
