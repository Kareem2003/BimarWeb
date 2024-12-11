import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "react-spring";
import { useGesture } from "react-use-gesture";
import { X } from "react-feather";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const { opacity, transform } = useSpring(() => ({
    opacity: 1,
    transform: "translateX(0)",
  }));
  const bind = useGesture({
    onDrag: ({ down, movement: [x], direction: [dx], distance, cancel }) => {
      if (down && distance > window.innerWidth / 2) {
        cancel((onClose) => {
          if (dx > 0) {
            onClose();
          }
        });
      }
    },
  });

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
      {...bind()}
      className={`fixed bottom-0 right-0 left-0 p-4 rounded flex items-center justify-between z-50 ${typeStyles[type]}`}
      style={{ opacity, transform }}
    >
      <p className="text-white flex-1">{message}</p>
      <button onClick={closeToast} className="ml-4">
        <X className="text-white" size={16} />
      </button>
    </animated.div>
  );
};

export default Toast;
