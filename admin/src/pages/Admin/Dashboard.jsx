import React from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  UserCheck,
  Map,
  RefreshCw,
} from "lucide-react";
import { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { assets } from "../..//assets/assets";
import StatusBadge from "../../component/StatusBadge";
import Loader from "../../component/Loader";
import { toast } from "react-toastify";
import ColorCard from "../../component/ColorCard";

const Dashboard = () => {
  const { formatedDate, loading, setLoading } = useContext(AppContext);
  const {
    dashData,
    setDashData,
    getDashData,
    aToken,
    backendUrl,
    deleteReportById,
  } = useContext(AdminContext);

  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    setIsRefreshing(true);
    try {
      const updatedDashData = await getDashData();
      if (updatedDashData) {
        setDashData(updatedDashData);
        toast.success("Dashboard refreshed successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!aToken) return;
      if (!dashData?.latestReports?.length) setLoading(true);

      try {
        await getDashData();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [aToken]);

  return (
    <div className="py-4 sm:py-7 min-h-screen">
      <div className="mb-5">
        <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
          EcoBin Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor waste reports, workers & zones in real-time
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ColorCard
          title="Total Reports"
          value={dashData.reports}
          icon={<FileText size={26} />}
          gradient="from-blue-400 to-indigo-400"
        />

        <ColorCard
          title="Pending Reports"
          value={dashData.pendingReports}
          icon={<Clock size={26} />}
          gradient="from-yellow-400 to-orange-400"
        />

        <ColorCard
          title="Completed"
          value={dashData.completedReports}
          icon={<CheckCircle size={26} />}
          gradient="from-green-400 to-emerald-600"
        />

        <ColorCard
          title="Rejected"
          value={dashData.rejectedReports}
          icon={<XCircle size={26} />}
          gradient="from-red-400 to-pink-600"
        />

        <ColorCard
          title="Total Users"
          value={dashData.users}
          icon={<Users size={26} />}
          gradient="from-purple-500 to-violet-600"
        />

        <ColorCard
          title="Total Workers"
          value={dashData.workers}
          icon={<UserCheck size={26} />}
          gradient="from-teal-400 to-cyan-600"
        />

        <ColorCard
          title="Active Workers"
          value={dashData.activeWorkers}
          icon={<UserCheck size={26} />}
          gradient="from-teal-400 to-cyan-600"
        />

        <ColorCard
          title="Active Zones"
          value={dashData.zones}
          icon={<Map size={26} />}
          gradient="from-rose-400 to-fuchsia-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base sm:text-xl font-semibold text-gray-800">
              Latest Reports
            </h2>
            <span className="text-xs sm:text-sm text-gray-500 block lg:hidden">
              Top 5 Recent Reports
            </span>
          </div>
          <span className="text-sm text-gray-500 lg:block hidden">
            Top 5 Recent Reports
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="flex hidden sm:block items-center justify-center h-9 w-9 text-sm text-blue-600 bg-blue-50 rounded-full hover:text-blue-800 hover:bg-blue-100 cursor-pointer"
            >
              <i
                className={`fa-solid  ${
                  isRefreshing
                    ? "fa-arrow-rotate-right animate-spin"
                    : "fa-arrows-rotate"
                }`}
              ></i>
            </button>

            <button
              onClick={() => navigate("/all-reports")}
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 py-2 px-3 sm:py-2 sm:px-4 rounded-full hover:text-blue-800 hover:bg-blue-100 transition cursor-pointer"
            >
              View All <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left  whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                <th className="px-6 py-4 rounded-l-xl">Report Id</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Waste Type</th>
                <th className="px-6 py-4">Zone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Time (Status Updated)</th>
                <th className="px-6 py-4 rounded-r-xl">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading &&
              (!dashData.latestReports ||
                dashData.latestReports.length === 0) ? (
                <tr>
                  <td colSpan="7" className="py-20">
                    <div className="flex justify-center items-center">
                      <Loader />
                    </div>
                  </td>
                </tr>
              ) : dashData.latestReports &&
                dashData.latestReports.length > 0 ? (
                dashData.latestReports?.map((report) => (
                  <tr
                    key={report._id}
                    className="bg-white hover:bg-gray-50 transition border-b border-gray-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-700">
                      #{report._id.slice(-5)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={report.userId?.image}
                          alt="user"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <span className="text-gray-700 font-medium">
                          {report.userId?.name || "User"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {report.wasteType}
                    </td>

                    <td className="px-6 py-4">
                      {report.zone ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">
                          {report.zone.name}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                          Not Assigned
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={report.status} className="text-xs" />
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {report.status === "Pending" &&
                        formatDistanceToNow(new Date(report.createdAt), {
                          addSuffix: true,
                        })}
                      {(report.status === "Assigned" ||
                        report.status === "In Process") &&
                        formatDistanceToNow(new Date(report.assignedAt), {
                          addSuffix: true,
                        })}
                      {report.status === "Completed" &&
                        formatDistanceToNow(new Date(report.completedAt), {
                          addSuffix: true,
                        })}
                      {report.status === "Cancelled" &&
                        formatDistanceToNow(new Date(report.canceledAt), {
                          addSuffix: true,
                        })}
                      {report.status === "In Review" &&
                        formatDistanceToNow(
                          new Date(report.workerVerification.verifiedAt),
                          {
                            addSuffix: true,
                          },
                        )}
                      {report.status === "Rejected" &&
                        formatDistanceToNow(new Date(report.rejectedAt), {
                          addSuffix: true,
                        })}

                      {report.status === "Delay" &&
                        report.expectedCompletion && (
                          <span className="text-red-400 font-medium">
                            Delayed by{" "}
                            {formatDistanceToNow(
                              new Date(report.expectedCompletion),
                              {
                                addSuffix: false,
                              },
                            )}
                          </span>
                        )}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/report/${report._id}`)}
                          className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 hover:text-blue-700 transition text-sm font-medium cursor-pointer"
                        >
                          View
                        </button>

                        <button
                          onClick={() => deleteReportById(report._id)}
                          className="flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-full hover:bg-red-100 hover:text-red-700 transition text-sm font-medium cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center text-base py-10 text-gray-500"
                  >
                    No reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
