import React, { useContext, useEffect } from "react";
import { WorkerContext } from "../../context/WorkerContext";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import Loader from "../../component/Loader";
import { ClipboardCheck, UserCheck, CheckCircle } from "lucide-react";
import StatusBadge from "../../component/StatusBadge";

const WorkerDashboard = () => {
  const {
    wToken,
    profileData,
    getProfileData,
    dashData,
    setDashData,
    getDashData,
  } = useContext(WorkerContext);
  const { loading, setLoading } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!wToken) return;

      const showLoader = !profileData || !dashData;
      if (showLoader) setLoading(true);

      try {
        if (!profileData) await getProfileData();
        if (!dashData) await getDashData();
      } catch (err) {
        console.log(err);
      } finally {
        if (showLoader) setLoading(false);
      }
    };
    fetchData();
  }, [wToken]);

  if (!profileData) return null;

  return (
    <div className="py-3 sm:py-6 space-y-6">
      <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
        EcoBin Worker Dashboard
      </h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {/* Assigned Today */}
        <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center transform hover:-translate-y-1  transition duration-300">
          <div className="w-12 h-12 md:w-15 md:h-15 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <UserCheck className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
          </div>
          <span className="text-gray-500 text-base font-medium">
            Assigned Today
          </span>
          <span className="text-3xl font-bold mt-1 text-gray-800">
            {dashData?.summary?.assignedToday}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center transform hover:-translate-y-1  transition duration-300">
          <div className="w-12 h-12 md:w-15 md:h-15 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
          </div>
          <span className="text-gray-500 text-base font-medium">
            Completed Today
          </span>
          <span className="text-3xl font-bold mt-1 text-gray-800">
            {dashData?.summary?.completedToday}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center transform hover:-translate-y-1  transition duration-300">
          <div className="w-12 h-12 md:w-15 md:h-15 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <ClipboardCheck className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
          </div>
          <span className="text-gray-500 text-base font-medium">
            Total Completed
          </span>
          <span className="text-3xl font-bold mt-1 text-gray-800">
            {dashData?.summary?.totalCompleted}
          </span>
        </div>
      </div>

      {/* Top 5 Assigned Reports Table */}
      <div className="bg-white rounded-2xl shadow-md p-3 md:p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-600">
              Top Assigned Reports
            </h2>
            <span className="text-xs sm:text-sm text-gray-500 block md:hidden">
              Latest 5 Reports
            </span>
          </div>

          <span className="text-sm text-gray-500 md:block hidden">
            Latest 5 Reports
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
                <th className="px-6 py-4 rounded-l-xl">Report ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Waste Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 rounded-r-xl">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-40">
                    <Loader />
                  </td>
                </tr>
              ) : dashData?.topReports?.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-20 text-center text-gray-500 text-base md:text-lg"
                  >
                    No reports Assigned yet
                  </td>
                </tr>
              ) : (
                dashData?.topReports?.map((report) => (
                  <tr
                    key={report._id}
                    className="bg-white text-gray-500 hover:bg-gray-50 transition border-b border-gray-200"
                  >
                    <td className="px-6 py-4 font-medium ">
                      #{report._id.slice(-6)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={report.userId?.image || "/user.png"}
                          alt="user"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <span className="text-gray-500 font-medium">
                          {report.userId?.name || "User"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">{report.wasteType}</td>

                    <td className="px-6 py-4">{report.location}</td>

                    <td className="px-6 py-4">
                      <StatusBadge status={report.status} className="text-xs" />
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => {
                          navigate(`/assign-report/${report._id}`);
                          scrollTo(0, 0);
                        }}
                        className="px-2 py-1 flex items-center justify-center gap-1
                          rounded-2xl border border-blue-200 text-blue-500 
                         hover:bg-blue-50 active:scale-95 transition cursor-pointer"
                      >
                        View <i className="fa-solid fa-arrow-right text-sm"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
