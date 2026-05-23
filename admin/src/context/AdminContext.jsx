import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : "",
  );
  const [workers, setWorkers] = useState([]);
  const [reports, setReports] = useState([]);
  const [zones, setZones] = useState([]);
  const [dashData, setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const rejectReport = async (reportId, reason) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/report/reject/${reportId}`,
        { reason },
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success("Report rejected successfully");
        // Optionally update local state
        setReports((prev) =>
          prev.map((r) =>
            r._id === reportId ? { ...r, status: "Rejected" } : r,
          ),
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const getAllWorkers = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-workers",
        {},
        { headers: { aToken } },
      );
      if (data.success) {
        setWorkers(data.workers);
        console.log(data.workers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const ChangeAvailability = async (worId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { worId },
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success(data.message);
        getAllWorkers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllReports = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/reports", {
        headers: { aToken },
      });
      if (data.success) {
        setReports(data.reports);
        console.log(data.reports);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getReportDetail = async (id) => {
    try {
      const { data } = await axios.get(backendUrl + `/api/admin/report/${id}`, {
        headers: { atoken: aToken },
      });

      if (data.success) {
        return data.report;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  const getDashData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });
      if (data.success) {
        setDashData(data.dashData);
        return data.dashData;
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  });

  const getAllZones = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/zones");

      if (data.success) {
        setZones(data.zones);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteReportById = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const { data } = await axios.delete(
        backendUrl + `/api/admin/report/${reportId}`,
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success("Report deleted successfully");

        // Safe update for dashData.latestReports
        setDashData((prev) => ({
          ...prev,
          latestReports:
            prev.latestReports?.filter((r) => r._id !== reportId) || [],
        }));

        // Safe update for reports
        setReports((prev) =>
          prev ? prev.filter((r) => r._id !== reportId) : [],
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    workers,
    setWorkers,
    getAllWorkers,
    ChangeAvailability,
    reports,
    setReports,
    getAllReports,
    getReportDetail,
    dashData,
    setDashData,
    getDashData,
    getAllZones,
    zones,
    setZones,
    rejectReport,
    deleteReportById,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
