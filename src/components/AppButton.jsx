import React from "react";

const AppButton = ({ title, onPress, buttonStyle = "", textStyle = "" }) => {
  return (
    <button
      className={`group bg-tertiary w-[90%] rounded-3xl py-2 px-10 flex justify-center items-center cursor-pointer hover:bg-white transition duration-300 ${buttonStyle}`}
      onClick={onPress}
    >
      <span
        className={`text-center text-xl font-bold uppercase text-white group-hover:text-black transition duration-300 ${textStyle}`}
      >
        {title}
      </span>
    </button>
  );
};

export default AppButton;
