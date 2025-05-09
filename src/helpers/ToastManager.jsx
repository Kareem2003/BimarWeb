import React, { useState, useEffect } from "react";
import Toast from "../components/Toast";

const ToastManager = (() => {
  const toasts = [];
  const listeners = [];

  const notify = (message, options) => {
    const id = Math.random().toString(36).substr(2, 9);
    console.log("Toast Notification:", { id, message, ...options });
    toasts.push({ id, message, ...options });
    listeners.forEach((listener) => listener([...toasts]));
    setTimeout(() => dismiss(id), options?.duration || 3000);
  };

  const dismiss = (id) => {
    const index = toasts.findIndex((toast) => toast.id === id);
    if (index !== -1) toasts.splice(index, 1);
    listeners.forEach((listener) => listener([...toasts]));
  };

  const onChange = (callback) => listeners.push(callback);

  return { notify, onChange, dismiss };
})();

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    ToastManager.onChange(setToasts);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => ToastManager.dismiss(toast.id)}
        />
      ))}
    </div>
  );
};

export { ToastManager, ToastContainer };
