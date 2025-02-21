import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "react-spring";
import { X } from "react-feather";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const { opacity, transform } = useSpring(() => ({
    opacity: 1,
    transform: "translateX(0)",
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      closeToast();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const closeToast = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const typeStyles = {
    info: { backgroundColor: "#007bff" },
    success: { backgroundColor: "#28a745" },
    warning: { backgroundColor: "#ffc107" },
    error: { backgroundColor: "#dc3545" },
  };

  return (
    <animated.div
      className="fixed bottom-5 right-5 p-4 rounded-md shadow-lg flex items-center justify-between z-50"
      style={{ ...typeStyles[type], opacity, transform }}
    >
      <p className="text-white flex-1">{message}</p>
      <button onClick={closeToast} className="ml-4 hover:opacity-75">
        <X className="text-white" size={16} />
      </button>
    </animated.div>
  );
};

export default Toast;
