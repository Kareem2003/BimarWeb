import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "./helpers/contexts/appContext.jsx";
import ThemeProvider from "./helpers/contexts/themeContext.jsx";
import { ToastContainer } from "./helpers/ToastManager.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider>
      <ThemeProvider>
        <App />
        <ToastContainer />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);
