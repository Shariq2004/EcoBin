import React, { useState, useRef, useEffect } from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import StatusBadge from "../../component/StatusBadge";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../component/Loader";

const AllReports = () => {
  const {
    aToken,
    reports,
    getAllReports,
    backendUrl,
    setReports,
    deleteReportById,
  } = useContext(AdminContext);
  const { formatedDate, loading, setLoading } = useContext(AppContext);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [rejectReportId, setRejectReportId] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropDownRef = useRef(null);

  const statusOptions = [
    "All",
    "Pending",
    "Assigned",
    "In Review",
    "In Process",
    "Completed",
    "Rejected",
    "Delay",
  ];

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);

  const [showExtendModal, setShowExtendModal] = useState(false);

  const [customHours, setCustomHours] = useState("");

  const filteredReports = reports.filter((report, index) => {
    const searchText = search.toLowerCase().replace(/\s+/g, "");

    const userName =
      report.userId?.name?.toLowerCase().replace(/\s+/g, "") || "";
    const location = report.location?.toLowerCase().replace(/\s+/g, "") || "";
    const reportId = report._id?.toLowerCase().replace(/\s+/g, "") || "";

    const matchesSearch =
      userName.includes(searchText) ||
      location.includes(searchText) ||
      reportId.includes(searchText);

    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRejectClick = () => {
    setOpenMenuId(null);
    setIsRejectModalOpen(true);
  };

  const sendWarning = async () => {
    if (!warningMessage) {
      toast.error("Please enter warning message");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/send-warning`,
        {
          reportId: selectedReportId,
          message: warningMessage,
        },
        {
          headers: {
            aToken,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        setShowWarningModal(false);
        setWarningMessage("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const extendTime = async (reportId, hours) => {
    if (hours > 12) {
      toast.error("Maximum 12 hours allowed");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/extend-report-time`,
        { reportId, hours },
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success(`Extended by ${hours} hours`);
        setShowExtendModal(false);
        setCustomHours("");

        await getAllReports();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter rejection reason");
      return;
    }

    console.log(
      "Reject URL:",
      backendUrl + `/api/admin/report-reject/${rejectReportId}`,
    );
    console.log("Reject Report ID:", rejectReportId);

    try {
      const { data } = await axios.put(
        backendUrl + `/api/admin/report-reject/${rejectReportId}`,
        { rejectionReason },
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success(data.message);
        setReports((prev) => prev.filter((r) => r._id !== rejectReportId));
        setIsRejectModalOpen(false);
        setRejectionReason("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchReports = async () => {
    if (aToken) {
      if (reports && reports.length > 0) return;
      setLoading(true);
      await getAllReports();
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [aToken]);

  return (
    <div className="py-4 sm:py-7 w-full min-h-screen">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
        All Reports
      </h1>

      <div className="w-full mb-4 md:mb-5 flex flex-col md:flex-row items-center gap-2 md:gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-[80%]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location (e.g. Sector 21)..."
            className="peer w-full pl-10 pr-10 py-2.5 md:py-3.5 rounded-xl 
               bg-white border border-gray-200 
               text-gray-700 text-sm md:text-base 
               shadow-sm focus:shadow-md 
               focus:border-green-500 focus:ring-2 focus:ring-green-200 
               outline-none transition-all duration-200"
          />

          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-green-500 transition-colors duration-200">
            <i className="fa-solid fa-magnifying-glass text-sm md:text-base"></i>
          </span>

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Dropdown Filter */}
        <div className="relative w-full md:w-[20%]" ref={dropDownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-white border border-gray-300 px-4 py-2 md:py-3.5 rounded-xl shadow-sm flex justify-between items-center cursor-pointer hover:border-green-500 transition"
          >
            <span className="text-gray-700 text-sm md:text-base">
              {statusFilter}
            </span>

            <i
              className={`fa-solid fa-chevron-down text-gray-500 transition duration-300 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            ></i>
          </div>

          {/* Dropdown menu */}

          <div
            className={`absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 origin-top z-40
    ${
      dropdownOpen
        ? "opacity-100 translate-y-0 scale-100"
        : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
    }`}
          >
            {statusOptions.map((status, index) => (
              <div
                key={index}
                onClick={() => {
                  setStatusFilter(status);
                  setDropdownOpen(false);
                }}
                className={`px-4 py-2.5 text-sm md:text-base cursor-pointer flex justify-between items-center transition-colors
        ${
          statusFilter === status
            ? "bg-green-100 text-green-700 font-medium"
            : "hover:bg-gray-100 text-gray-700"
        }`}
              >
                {status}

                {statusFilter === status && (
                  <i className="fa-solid fa-check text-green-600 text-sm"></i>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md h-[calc(100vh-230px)] overflow-hidden">
        <div className="overflow-x-auto h-full">
          <table className="min-w-max w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">S.No.</th>
                <th className="px-6 py-4 whitespace-nowrap">User</th>
                <th className="px-6 py-4 whitespace-nowrap">Report ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Waste Type</th>
                <th className="px-6 py-4 whitespace-nowrap">Location</th>
                <th className="px-6 py-4 whitespace-nowrap">Date & Time</th>
                <th className="px-6 py-4 whitespace-nowrap">Worker</th>
                <th className="px-6 py-4  whitespace-nowrap">Report Status</th>
                <th className="px-6 py-4  whitespace-nowrap">Waste Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-gray-500">
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="py-50 text-center text-gray-500 text-sm"
                  >
                    <Loader />
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="9">
                    <p className="text-base md:text-xl text-center text-gray-500 my-50">
                      No reports created yet
                    </p>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="9">
                    <p className="text-base md:text-xl text-center text-gray-500 my-50">
                      No Search result found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report, index) => (
                  <tr key={report._id} className="hover:bg-gray-50 transition">
                    {/* S.NO */}
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={report.userId?.image}
                          className="w-9 h-9 rounded-full object-cover"
                          alt=""
                        />
                        <span className="font-medium">
                          {report.userId?.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-600">
                      {report._id}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.wasteType}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.location || "N/A"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {formatedDate(report.createdAt)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.status === "Cancelled" ? (
                        <span className="px-4 py-1 text-sm text-gray-600 bg-gray-200 rounded-full">
                          N/A
                        </span>
                      ) : report.assignedWorker ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={report.assignedWorker.image}
                            className="w-9 h-9 rounded-full bg-gray-200"
                            alt=""
                          />
                          <span>{report.assignedWorker.name}</span>
                        </div>
                      ) : (
                        <span className="px-4 py-1 text-sm bg-red-50 text-red-600 rounded-full">
                          Not Available
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <StatusBadge status={report.status} className="text-xs" />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.status === "Cancelled" ? (
                        <span className="px-4 py-1 text-sm text-gray-600 bg-gray-200 rounded-full">
                          N/A
                        </span>
                      ) : (
                        <StatusBadge
                          status={report.workerVerification.status}
                          className="text-xs"
                        />
                      )}
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            navigate(`/report/${report._id}`);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 hover:text-blue-700 transition text-sm font-medium cursor-pointer"
                        >
                          View
                        </button>

                        {(report.status === "Pending" ||
                          report.status === "Assigned" ||
                          report.status === "In Review" ||
                          report.status === "In Process") && (
                          <button
                            onClick={() => {
                              setRejectReportId(report._id);
                              setOpenMenuId(null);
                              handleRejectClick();
                            }}
                            className="flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-full hover:bg-red-100 hover:text-red-700 transition text-sm font-medium cursor-pointer"
                          >
                            Reject
                          </button>
                        )}

                        <button
                          onClick={() => {
                            deleteReportById(report._id);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-full transition text-sm font-medium cursor-pointer"
                        >
                          Delete
                        </button>

                        {report.status === "Delay" && (
                          <>
                            <button
                              onClick={() => {
                                setShowExtendModal(true);
                                setSelectedReportId(report._id);
                              }}
                              className="px-3 py-1 bg-green-50 text-green-600 rounded-full hover:bg-green-100 hover:text-green-700 transition text-sm font-medium cursor-pointer"
                            >
                              Extend Time
                            </button>
                            <button
                              onClick={() => {
                                setShowWarningModal(true);
                                setSelectedReportId(report._id);
                              }}
                              className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-600 transition text-sm font-medium cursor-pointer"
                            >
                              Send Warning
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[90]">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h2 className="text-lg text-gray-600 font-semibold mb-4">
              Enter Rejection Reason
            </h2>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-sm md:text-base border-3 border-gray-300 rounded-lg p-2 mb-4 text-gray-700
               transition-colors duration-300 ease-in-out 
               focus:outline-none focus:border-green-500"
              rows={4}
              placeholder="Enter reason..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40  backdrop-blur-xs z-90">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-lg font-semibold text-gray-600 mb-3">
              Send Warning to Worker
            </h2>

            <textarea
              placeholder="Type warning message..."
              value={warningMessage}
              onChange={(e) => setWarningMessage(e.target.value)}
              className="w-full text-sm md:text-base border-3 border-gray-300 rounded-lg p-2 mb-4 text-gray-700
               transition-colors duration-300 ease-in-out 
               focus:outline-none focus:border-green-500"
              rows={4}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowWarningModal(false)}
                className="px-4 py-1.5 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={sendWarning}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-md cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TimeExtend Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs z-90">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">
              Extend Report Time
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => extendTime(selectedReportId, 1)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-full cursor-pointer transition-colors duration-200 ease-in-out "
              >
                +1 hr
              </button>

              <button
                onClick={() => extendTime(selectedReportId, 2)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-full cursor-pointer transition-colors duration-200 ease-in-out"
              >
                +2 hr
              </button>

              <button
                onClick={() => extendTime(selectedReportId, 3)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-full cursor-pointer transition-colors duration-200 ease-in-out"
              >
                +3 hr
              </button>

              <button
                onClick={() => extendTime(selectedReportId, 4)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-full cursor-pointer  transition-colors duration-200 ease-in-out"
              >
                +4 hr
              </button>
            </div>

            <p className="text-center text-gray-500 mb-3">OR</p>

            <input
              type="number"
              placeholder="Custom hours"
              value={customHours}
              onChange={(e) => setCustomHours(e.target.value)}
              className="w-full text-sm md:text-base border-3 border-gray-300 rounded-lg p-2 mb-4 text-gray-700
               transition-colors duration-300 ease-in-out 
               focus:outline-none focus:border-green-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  if (!customHours)
                    return toast.error(
                      "Please enter hours or select from buttons",
                    );
                  extendTime(selectedReportId, Number(customHours));
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Extend
              </button>

              <button
                onClick={() => setShowExtendModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReports;
