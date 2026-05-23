import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";
import AdminContextProvider from "./context/AdminContext.jsx";
import WorkerContextProvider from "./context/WorkerContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { jwtDecode } from "jwt-decode";

const aToken = localStorage.getItem("aToken");
const wToken = localStorage.getItem("wToken");

let userId = null;
let userRole = null;

if (aToken) {
  userRole = "admin";
  userId = "admin";
} else if (wToken) {
  userRole = "worker";
  console.log("wToken:", wToken);
  try {
    const decoded = jwtDecode(wToken);
    userId = decoded.id;
  } catch (err) {
    console.error("Failed to decode JWT:", err);
    userId = null;
  }
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <WorkerContextProvider>
        <AppContextProvider>
          <NotificationProvider userId={userId} userRole={userRole}>
            <App />
          </NotificationProvider>
        </AppContextProvider>
      </WorkerContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
);
