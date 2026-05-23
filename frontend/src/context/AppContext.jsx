import { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { format, isToday, isTomorrow } from "date-fns";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false,
  );
  const [userData, setUserData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [impact, setImpact] = useState({
  reportsSubmitted: 0,
  reportsResolved: 0,
  wasteTypesReported: 0,
  rewardPointsEarned: 0
}); 

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };


  const fetchImpact = async () => {
    try {

      const { data } = await axios.get(
        backendUrl + "/api/user/impact",
        { headers: { token } }
      );

      if (data.success) {
        setImpact(data.impact);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const formatExpectedCompletion = (expectedTime) => {
    const target = new Date(expectedTime);

    const timeStr = format(target, "hh:mm a");

    if (isToday(target)) return `today by ${timeStr}`;
    if (isTomorrow(target)) return `tomorrow by ${timeStr}`;

    return `on ${format(target, "dd/MM/yyyy")} by ${timeStr}`;
  };

  const value = {
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    loading,
    setLoading,
    reports,
    setReports,
    transactions,
    setTransactions,
    formatExpectedCompletion,
    impact,
    fetchImpact
  };

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
