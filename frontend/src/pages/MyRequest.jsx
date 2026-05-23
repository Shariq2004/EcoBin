import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import useClickOutside from "../hooks/useClickOutside";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";

function MyRequests() {
  const {
    backendUrl,
    loading,
    setLoading,
    reports,
    setReports,
    token,
    formatExpectedCompletion,
    fetchImpact,
  } = useContext(AppContext);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropDownRef = useRef();

  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [currentReason, setCurrentReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  const statusOptions = [
    "All",
    "Pending",
    "Assigned",
    "In Process",
    "Completed",
    "Rejected",
    "Cancelled",
  ];

  useClickOutside(dropDownRef, () => {
    setDropdownOpen(false);
  });

  const normalize = (str) => {
    return str.toLowerCase().replace(/\s+/g, "");
  };

  const filteredReports = reports.filter((req) => {
    const searchText = normalize(search);
    const locationText = normalize(req.location);

    const matchesSearch = locationText.includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      req.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;

  const currentReports = filteredReports.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/settings/get");

      if (data.success) {
        setShowTime(data.settings.showExpectedCompletionTime);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(backendUrl + "/api/report/my-reports", {
        headers: { token },
      });

      if (data?.success && Array.isArray(data.data)) {
        setReports(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelReport = async (reportId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/report/cancel-report",
        { reportId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        setReports((prev) =>
          prev.map((r) =>
            r._id === reportId
              ? { ...r, status: "Cancelled", isCanceled: true }
              : r,
          ),
        );

        fetchImpact();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    if (reports.length === 0) {
      fetchReports();
    }

    fetchSettings();
    fetchImpact();
  }, [token]);

  return (
    <div className="w-full  px-5 sm:px-9 lg:px-[9%] pt-20 md:pt-24 pb-15 bg-[#F5FBF9]">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-medium md:font-semibold text-gray-800 mb-3 md:mb-6">
        My Requests
      </h1>

      <div className="w-full mb-4 md:mb-8 flex flex-col md:flex-row items-center gap-2 md:gap-4">
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
               focus:border-green-500 
               focus:ring-2 focus:ring-green-200 
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

      {/* REQUEST CARDS */}
      {loading ? (
        <div className="py-50">
          <Loader />
        </div>
      ) : reports.length === 0 ? (
        <p className="text-base md:text-xl text-center text-gray-500 my-50">
          No reports created yet
        </p>
      ) : filteredReports.length === 0 ? (
        <p className="text-base md:text-xl text-center text-gray-500 my-55">
          No search results found
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {currentReports.map((req) => (
            <div
              key={req._id}
              className="w-full bg-white shadow-md p-2 sm:p-3 rounded-xl 
                 flex flex-col md:flex-row gap-4 
                 hover:shadow-lg transition border border-gray-200"
            >
              <img
                src={req.image?.url || "/placeholder.png"}
                alt="waste-image"
                className="w-full md:max-w-50  h-40 sm:h-48 md:h-30 object-cover rounded-lg"
              />

              {/* RIGHT CONTENT */}
              <div className="w-full flex flex-col md:flex-row md:justify-between  px-1 md:p-0 pb-2">
                {/* LEFT SIDE – LOCATION + WASTE DETAILS */}
                <div className="flex-1 flex flex-col gap-3 lg:gap-5">
                  <p className="text-gray-800 font-medium text-base md:text-lg leading-snug">
                    <i className="fa-solid fa-location-dot text-gray-600 mr-2"></i>
                    {req.location}
                  </p>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-1 xl:gap-15 text-sm sm:text-base text-gray-600">
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-trash-can"></i>
                      {req.wasteType}
                    </span>

                    <span className="flex items-center gap-2">
                      <i className="fa-regular fa-cloud"></i>
                      {req.quantity}
                    </span>

                    <span className="flex items-center gap-2">
                      <i className="fa-regular fa-calendar"></i>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* RIGHT SIDE – STATUS + BUTTON + REWARD */}
                <div className="flex flex-col justify-between md:items-end md:min-w-[220px]">
                  <div
                    className={`flex flex-col md:items-end md:min-w-[220px] ${req.status === "Completed" ? "gap-1 md:gap-6" : "gap-2 md:gap-5"} mt-2 md:mt-0`}
                  >
                    <StatusBadge
                      status={req.status}
                      className="text-xs md:text-sm md:self-end"
                    />

                    <div className="text-gray-600 text-xs lg:text-sm text-left md:text-right">
                      {req.status === "Completed" ? (
                        <span className="block">
                          Completed at{" "}
                          {new Date(req.completedAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      ) : req.status === "Delay" ? (
                        <div className="flex flex-row items-center gap-1">
                          <span className="font-medium">
                            Expected completion :
                          </span>
                          <span className="text-red-500 font-semibold">
                            Overdue
                          </span>
                        </div>
                      ) : (
                        req.expectedCompletion && (
                          <span>
                            <span className="font-medium">
                              <span className="md:hidden ms-0.5">
                                <i className="fa-regular fa-clock mr-1"></i>
                              </span>
                              Expected completion :{" "}
                            </span>
                            {formatExpectedCompletion(req.expectedCompletion)}
                          </span>
                        )
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {req.status === "Pending" && !req.isCanceled && (
                        <button
                          onClick={() => cancelReport(req._id)}
                          className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition w-full md:mt-4 cursor-pointer"
                        >
                          Cancel Report
                        </button>
                      )}

                      {req.status !== "Pending" &&
                        req.status !== "Rejected" &&
                        req.status !== "Completed" &&
                        req.status !== "Cancelled" && (
                          <button
                            onClick={() => {
                              setSelectedWorker(req.assignedWorker);
                              setShowWorkerModal(true);
                            }}
                            className="text-sm px-3 py-1.5 rounded-lg text-white bg-green-500 hover:bg-green-600 transition font-medium w-full cursor-pointer"
                          >
                            View Worker
                          </button>
                        )}

                      {req.status === "Rejected" && (
                        <button
                          onClick={() => {
                            setCurrentReason(req.rejectionReason);
                            setIsReasonModalOpen(true);
                          }}
                          className="text-sm px-3 py-1.5 rounded-lg text-white bg-green-500 hover:bg-green-600 transition font-medium w-full"
                        >
                          View Reason
                        </button>
                      )}

                      {req.status === "Completed" && req.isCompleted && (
                        <span className="text-green-600 font-semibold text-sm sm:text-base">
                          Reward Earned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reports.length > 5 && (
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={currentPage === 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
          className="px-2 py-0.5 sm:px-4 sm:py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed  cursor-pointer  enabled:hover:text-white enabled:hover:bg-green-500"
        >
          Previous
        </button>

        <span className="text-sm sm:text-base">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
          className="px-2 py-0.5 sm:px-4 sm:py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer enabled:hover:text-white enabled:hover:bg-green-500"
        >
          Next
        </button>
      </div>
     )}

      {/* worker modal */}
      {showWorkerModal && selectedWorker && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="relative w-full max-w-md bg-white backdrop-blur-xl rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <button
              onClick={() => setShowWorkerModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-lg cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <img
                  src={selectedWorker.image}
                  alt="worker"
                  className="w-28 h-28 rounded-full object-cover border-4 border-green-500 shadow-md"
                />
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
              </div>

              <h2 className="text-xl font-semibold text-gray-800">
                {selectedWorker.name}
              </h2>

              <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full">
                Waste Collection Worker
              </span>
            </div>

            <div className="my-5 border-t border-gray-400"></div>

            <div className="flex flex-col gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                <i className="fa-solid fa-envelope text-green-500"></i>
                <span>{selectedWorker.email}</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                <i className="fa-solid fa-phone text-green-500"></i>
                <span>{selectedWorker.phone}</span>
              </div>

              <div className="flex items-start gap-3 bg-gray-100 p-3 rounded-lg">
                <i className="fa-solid fa-location-dot text-green-500 mt-1"></i>
                <div>
                  <p>{selectedWorker.address.street}</p>
                  <p className="text-gray-500 text-xs">
                    {selectedWorker.address.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg capitalize">
                <i className="fa-solid fa-map text-green-500"></i>
                <span>Zone: {selectedWorker.zone.name}</span>
              </div>

              <a href={`tel:${selectedWorker.phone}`} className="flex-1">
                <button className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-medium">
                  <i className="fa-solid fa-phone"></i> Call
                </button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Reason modal */}
      {isReasonModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-70 sm:w-96 relative">
            <h2 className="text-base text-gray-800 sm:text-lg font-semibold mb-3">
              Rejection Reason
            </h2>
            <p className="text-gray-700 text-sm sm:text-base ">
              {currentReason}
            </p>
            <button
              onClick={() => setIsReasonModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyRequests;
