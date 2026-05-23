import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./component/Navbar";
import SideBar from "./component/SideBar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllReports from "./pages/Admin/AllReports";
import AdminReportDetail from "./pages/Admin/ReportDetail";
import AddWorker from "./pages/Admin/AddWorker";
import WorkerList from "./pages/Admin/WorkerList";
import WorkerDetail from "./pages/Admin/WorkerDetail";
import Zones from "./pages/Admin/Zones";
import { WorkerContext } from "./context/WorkerContext";
import WorkerDashboard from "./pages/Worker/WorkerDashboard";
import AssignReports from "./pages/Worker/AssignReports";
import WorkerReportDetail from "./pages/Worker/ReportDetail";
import WorkerProfile from "./pages/Worker/WorkerProfile";
import WorkerNotifications from "./pages/Notifications";
import AdminNotifications from "./pages/Notifications";
import Settings from "./pages/Admin/Settings";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { wToken } = useContext(WorkerContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (aToken) {
      document.title = "Admin Panel";
    } else if (wToken) {
      document.title = "Worker Panel";
    } else {
      document.title = "EcoBin";
    }
  }, [aToken, wToken]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
      />

      {aToken || wToken ? (
        <div className="bg-[#F5FBF9]  min-h-screen overflow-x-hidden py-7">
          <Navbar setIsSidebarOpen={setIsSidebarOpen} />
          <div className="flex pt-9 relative">
            <SideBar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
            <div className="flex-1 md:ml-68 px-4 sm:px-10 w-full overflow-x-hidden">
              <Routes>
                {/* Admin Routes */}

                <Route
                  path="/"
                  element={
                    aToken ? (
                      <Navigate to="/admin-dashboard" />
                    ) : wToken ? (
                      <Navigate to="/worker-dashboard" />
                    ) : (
                      <Login />
                    )
                  }
                />
                <Route path="/admin-dashboard" element={<Dashboard />} />
                <Route path="/all-reports" element={<AllReports />} />
                <Route path="/report/:id" element={<AdminReportDetail />} />
                <Route path="/add-worker" element={<AddWorker />} />
                <Route path="/worker-list" element={<WorkerList />} />
                <Route path="/worker/:id" element={<WorkerDetail />} />
                <Route path="/add-zones" element={<Zones />} />
                <Route
                  path="/all-notifications"
                  element={<AdminNotifications />}
                />
                <Route path="/settings" element={<Settings />} />

                {/* Worker Routes */}
                <Route path="/worker-dashboard" element={<WorkerDashboard />} />
                <Route path="/assign-reports" element={<AssignReports />} />
                <Route
                  path="/assign-report/:id"
                  element={<WorkerReportDetail />}
                />
                <Route path="/worker-profile" element={<WorkerProfile />} />
                <Route
                  path="/all-notifications"
                  element={<WorkerNotifications />}
                />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default App;
