import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import AppContextProvider, { AppContext } from './context/AppContext.jsx'
import { NotificationProvider } from "./context/notificationContext.jsx"
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");

let userId = null;
let userRole = null;

if (token) {
  try {
    const decoded = jwtDecode(token);
    userId = decoded.id;
    userRole = decoded.role || "user";
  } catch (err) {
    console.error("Failed to decode JWT:", err);
  }
}


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <NotificationProvider userId={userId} userRole={userRole}>
          <App />
        </NotificationProvider>
        <Toaster position="top-right"/>
      </AppContextProvider>
    </BrowserRouter>
  // </StrictMode>
)