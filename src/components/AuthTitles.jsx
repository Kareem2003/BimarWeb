import React from "react";

const AuthTitles = ({ text, descriptionText, titleClass }) => {
  return (
    <div>
      <h1
        className={`text-white text-4xl font-bold px-5 text-center ${titleClass}}`}
      >
        {text}
      </h1>
      {descriptionText && (
        <div className="text-tertiary text-2xl mt-5 px-5 text-center">
          {descriptionText}
        </div>
      )}
    </div>
  );
};

export default AuthTitles;
