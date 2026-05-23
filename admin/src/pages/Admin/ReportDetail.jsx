import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import Loader from "../../component/Loader";
import StatusBadge from "../../component/StatusBadge";
import {
  Hourglass,
  UserCheck,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { aToken, getReportDetail } = useContext(AdminContext);
  const { loading, setLoading } = useContext(AppContext);

  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!aToken || !id) return;
      if (report && report._id === id) return;

      setLoading(true);
      const data = await getReportDetail(id);
      setLoading(false);

      if (data) {
        setReport(data);
      }
    };

    fetchReport();
  }, [aToken, id]);

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
          Report Details
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
        >
          <i class="fa-solid fa-arrow-left"></i> Back
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center  h-[60vh]">
          <Loader />
        </div>
      ) : !report ? (
        <div className="text-center mt-50 text-gray-500 text-base">
          No report datails found
        </div>
      ) : (
        <div className=" mx-auto flex flex-col gap-6">
          {/* Report Card */}
          <div className="flex flex-col xl:flex-row gap-6 p-3 md:p-4 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div>
              <img
                src={report.image?.url}
                alt="report"
                className="w-full xl:w-100 h-64 object-cover rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-2 md:gap-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-7 ">
                <div className="flex items-center gap-3 group">
                  <div className="p-3 rounded-xl bg-green-50 text-green-600 group-hover:scale-110 transition">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-base font-semibold text-gray-800">
                      {report.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="p-3 rounded-xl bg-gray-100 text-gray-600 group-hover:scale-110 transition">
                    <i className="fa-solid fa-trash"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Waste Type</p>
                    <p className="text-base font-semibold text-gray-800">
                      {report.wasteType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition">
                    <i className="fa-solid fa-weight-hanging"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Quantity</p>
                    <p className="text-base font-semibold text-gray-800">
                      {report.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition">
                    <i className="fa-solid fa-calendar"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Created</p>
                    <p className="text-base font-semibold text-gray-800">
                      {new Date(report.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition">
                    <i class="fa-solid fa-user-check"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Assigned</p>
                    <p className="text-base font-semibold text-gray-800">
                      {report.assignedAt
                        ? new Date(report.assignedAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "Not Assigned"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="p-3 rounded-xl bg-green-100 text-green-500 group-hover:scale-110 transition">
                    <i class="fa-solid fa-check"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Completed</p>
                    <p className="text-base font-semibold text-gray-800">
                      {report.completedAt
                        ? new Date(report.completedAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "Not Completed"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2 md:mt-9 flex items-center justify-between bg-gray-100 rounded-xl p-2 sm:p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      report.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : report.status === "Assigned"
                          ? "bg-blue-100 text-blue-600"
                          : report.status === "In Process"
                            ? "bg-indigo-100 text-indigo-600"
                            : report.status === "Completed"
                              ? "bg-green-100 text-green-500"
                              : report.status === "Rejected"
                                ? "bg-red-100 text-red-500"
                                : report.status === "Cancelled"
                                  ? "bg-red-100 text-red-500"
                                  : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {report.status === "Pending" && (
                      <Hourglass className="w-6 h-6" />
                    )}
                    {report.status === "Assigned" && (
                      <UserCheck className="w-6 h-6" />
                    )}
                    {report.status === "In Process" && (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    )}
                    {report.status === "Completed" && (
                      <CheckCircle2 className="w-6 h-6" />
                    )}
                    {(report.status === "Rejected" ||
                      report.status === "Cancelled") && (
                      <XCircle className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs md:text-sm text-gray-400">Status</p>
                    <p className="hidden sm:block text-sm md:text-base font-semibold text-gray-800">
                      {report.status}
                    </p>
                  </div>
                </div>

                {/* Badge */}
                <StatusBadge
                  status={report.status}
                  className="text-xs md:text-base"
                />
              </div>
            </div>
          </div>

          {/* User Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col sm:flex-row items-center  gap-5 w-full mx-auto">
            <div className="flex-shrink-0">
              <img
                src={report?.userId?.image || "/default-user.png"}
                alt={report?.userId?.name}
                className="w-40 h-40  rounded-full object-cover border-4 border-green-100 shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1 text-center sm:text-left w-full">
              <p className="text-lg sm:text-2xl font-semibold text-gray-800">
                {report?.userId?.name || "No Name"}
              </p>

              <p className="text-gray-500 text-sm md:text-base flex items-center justify-center sm:justify-start gap-2">
                <i className="fa-solid fa-envelope text-green-500"></i>
                {report?.userId?.email || "No Email"}
              </p>

              <p className="text-gray-500 text-sm md:text-base flex items-center justify-center sm:justify-start gap-2">
                <i className="fa-solid fa-phone text-blue-400"></i>
                {report?.userId?.phone || "No Phone"}
              </p>

              <p className="text-gray-500 text-sm md:text-base flex items-center justify-center sm:justify-start gap-2">
                <i className="fa-solid fa-location-dot text-green-500"></i>
                {report?.userId?.address?.line1 || "No Address"}{" "}
                {report?.userId?.address?.line2 || ""}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetail;
