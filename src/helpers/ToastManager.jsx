import React, { useState, useEffect } from "react";

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
    <div className="fixed bottom-5 right-5 left-5 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between gap-4 p-4 rounded-md shadow-lg animate-slide-in bg-${
            toast.type === "success"
              ? "green-500"
              : toast.type === "error"
              ? "red-500"
              : toast.type === "warning"
              ? "yellow-500"
              : "gray-800"
          } text-white`}
        >
          <span>{toast.message}</span>
          <button
            className="text-white hover:text-gray-200"
            onClick={() => ToastManager.dismiss(toast.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export { ToastManager, ToastContainer };
