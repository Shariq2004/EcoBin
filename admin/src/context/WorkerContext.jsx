import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const WorkerContext = createContext();

const WorkerContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [wToken, setWToken] = useState(
    localStorage.getItem("wToken") ? localStorage.getItem("wToken") : "",
  );
  const navigate = useNavigate();
  const [assignReports, setAssignReports] = useState([]);
  const [profileData, setProfileData] = useState(false);
  const [dashData, setDashData] = useState(false);

  const getAssignReports = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/worker/assign-reports",
        { headers: { token: wToken } },
      );
      if (data.success) {
        setAssignReports(data.assignReports);
        console.log(data.assignReports);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAssignReportDetail = async (id) => {
    try {
      const { data } = await axios.get(
        backendUrl + `/api/worker/assign-report/${id}`,
        {
          headers: { token: wToken },
        },
      );

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

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/worker/profile", {
        headers: { token: wToken },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      } else {
        // toast.error(data.message);
        localStorage.removeItem("wToken");
        setWToken("");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateWorkerProfile = async (formData) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/worker/update-profile",
        formData,
        {
          headers: {
            token: wToken,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getProfileData();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/worker/dashboard-data",
        { headers: { token: wToken } },
      );
      if (data.success) {
        setDashData(data);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    wToken,
    setWToken,
    backendUrl,
    assignReports,
    setAssignReports,
    getAssignReports,
    profileData,
    setProfileData,
    getProfileData,
    getDashData,
    dashData,
    setDashData,
    getAssignReportDetail,
    updateWorkerProfile,
  };

  return (
    <WorkerContext.Provider value={value}>
      {props.children}
    </WorkerContext.Provider>
  );
};

export default WorkerContextProvider;

