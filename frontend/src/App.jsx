import React,{ useContext, useEffect } from "react"
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import WasteReport from './pages/WasteReport'
import MyRequest from './pages/MyRequest'
import HelpSupport from './pages/HelpSupport'
import Reward from './pages/Reward'
import MyProfile from './pages/MyProfile'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Footer from "./components/Footer"
import Notifications from "./pages/Notifications"


const App = () => {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report-waste" element={<WasteReport />} />
        <Route path="/my-request" element={<MyRequest />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/all-notifications" element={<Notifications />} />
      </Routes>
      <Footer />
    </div>
  )
}


export default App
