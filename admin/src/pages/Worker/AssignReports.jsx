import React, { useContext, useEffect, useState } from "react";
import { WorkerContext } from "../../context/WorkerContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../component/Loader";
import StatusBadge from "../../component/StatusBadge";
import { AdminContext } from "../../context/AdminContext";

const AssignReports = () => {
  const {
    wToken,
    getAssignReports,
    assignReports,
    setAssignReports,
    backendUrl,
    getProfileData,
  } = useContext(WorkerContext);

  const { loading, setLoading, formatExpectedCompletion } =
    useContext(AppContext);

  const navigate = useNavigate();
  const [showTime, setShowTime] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [proofFile, setProofFile] = useState(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const [verified, setVerified] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [completing, setCompleting] = useState(false);

  const [showConfirmWasteModal, setShowConfirmWasteModal] = useState(false);
  const [selectedReportForConfirmation, setSelectedReportForConfirmation] =
    useState(null);
  const [workerVerificationType, setWorkerVerificationType] = useState("");
  const [workerVerificationNote, setWorkerVerificationNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOpenConfirmWaste = (report) => {
    setSelectedReportForConfirmation(report);
    setShowConfirmWasteModal(true);
  };

  const handleCloseConfirmWaste = () => {
    setSelectedReportForConfirmation(null);
    setShowConfirmWasteModal(false);
    setWorkerVerificationType("");
    setWorkerVerificationNote("");
  };

  const handleSubmit = async () => {
    if (!workerVerificationType) {
      return toast.error("Please select an option");
    }

    if (
      (workerVerificationType === "Wrong Report" ||
        workerVerificationType === "Already Cleaned") &&
      (!workerVerificationNote || workerVerificationNote.trim() === "")
    ) {
      return toast.error("Please write a note for admin review");
    }

    setSubmitting(true);

    try {
      const res = await axios.post(
        backendUrl + "/api/worker/waste-confirm",
        {
          reportId: selectedReportForConfirmation._id,
          workerVerificationType,
          workerVerificationNote,
        },
        {
          headers: { token: wToken },
        },
      );

      console.log("API Response:", res.data);
      if (res.data.success) {
        toast.success(res.data.message);

        // After worker confirms waste
        setAssignReports((prevReports) =>
          prevReports.map((r) =>
            r._id.toString() === selectedReportForConfirmation._id.toString()
              ? {
                  ...r,
                  workerVerification: {
                    ...r.workerVerification,
                    status: workerVerificationType,
                    note: workerVerificationNote || "",
                  },
                }
              : r,
          ),
        );

        setWorkerVerificationType("");
        setWorkerVerificationNote("");
        setSelectedReportForConfirmation(null);
        setShowConfirmWasteModal(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  const normalize = (str) => {
    return str?.toLowerCase().replace(/\s+/g, "");
  };

  const filteredReports = assignReports.filter((report) => {
    const searchText = normalize(search); // user input
    const locationText = normalize(report.location);

    return locationText.includes(searchText);
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

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

  // Fetch with loader
  const fetchReports = async () => {
    let showLoader = assignReports.length === 0;
    if (showLoader) setLoading(true);
    try {
      await getAssignReports();
    } catch (err) {
      console.log(err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const { data } = await axios.put(
        backendUrl + `/api/worker/update-status/${reportId}`,
        { status: newStatus },
        {
          headers: { token: wToken },
        },
      );
      console.log("Sending Token:", wToken);
      if (data.success) {
        if (newStatus === "Completed") {
          toast.success("Waste verified and Collected successfully");
        } else {
          toast.success("Report status updated successfully");
        }
        fetchReports(); // refresh list
        getProfileData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerify = async () => {
    if (!image) {
      toast.error("Please verify an image first for proof");
      return;
    }

    try {
      setVerifying(true);

      const formData = new FormData();
      formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/api/worker/verify-waste/${selectedReportId}`,
        formData,
        {
          headers: {
            token: wToken,
          },
        },
      );

      if (data.success) {
        const report = data.data;

        setVerified(report.aiVerification?.verified || false);

        setVerificationResult({
          wasteTypeMatched: report.aiVerification?.wasteTypeMatched
            ? "Yes"
            : "No",
          quantityMatched: report.aiVerification?.quantityMatched
            ? "Yes"
            : "No",
          similarity: ((report.aiVerification?.similarity || 0) * 100).toFixed(
            2,
          ),
          reason: report.aiVerification?.reason || "No AI reason provided",
        });

        toast.success("Image Verified Successfully");
      } else {
        setVerified(false);
        setVerificationResult(null);

        if (data.message === "Report already verified") {
          toast.info(data.message);
        } else {
          toast.error(data.message || "Verification failed");
        }
      }
    } catch (err) {
      console.log(err.response?.data || err);
      toast.error("Verification failed ");
      setVerified(false);
      setVerificationResult(null);
    } finally {
      setVerifying(false);
    }
  };

  const handleComplete = async () => {
    if (!verified) return;

    try {
      setCompleting(true);
      const { data } = await axios.post(
        `${backendUrl}/api/worker/complete-report/${selectedReportId}`,
        {},
        {
          headers: { token: wToken },
        },
      );

      if (data.success) {
        toast.success("Report marked as completed");
        fetchReports();
        setShowProofModal(false);
        setImage(null);
        setPreview(null);
        setVerified(false);
        setVerificationResult(null);
      } else {
        toast.error(data.message || "Failed to complete");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to complete report ");
    } finally {
      setCompleting(false);
    }
  };

  useEffect(() => {
    if (wToken) {
      fetchReports();
    }
    fetchSettings();
  }, [wToken]);

  return (
    <div className="py-3 sm:py-6">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-5">
        My Assign Reports
      </h1>

      <div className="relative w-full mb-6">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm md:text-base"></i>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by location (e.g. Sector 21)..."
          className="w-full pl-10 pr-10 py-2.5 md:py-3.5 rounded-xl 
               bg-white border border-gray-200 
               text-gray-700 text-sm md:text-base 
               shadow-sm focus:shadow-md 
               focus:border-green-500 focus:ring-2 focus:ring-green-100 
               outline-none transition-all duration-200"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      {/* Assign Report CARDS */}

      {loading ? (
        <div className="py-50">
          <Loader />
        </div>
      ) : assignReports.length === 0 ? (
        <p className="text-base md:text-xl text-center text-gray-500 my-50">
          No reports assigned yet
        </p>
      ) : filteredReports.length === 0 ? (
        <p className="text-base md:text-xl text-center text-gray-500 my-50">
          No search results found
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              onClick={() => {
                navigate(`/assign-report/${report._id}`);
                scrollTo(0, 0);
              }}
              className="w-full bg-white shadow-md p-2 sm:p-3 rounded-xl 
                 flex flex-col lg:flex-row gap-4 
                 hover:shadow-lg transition border border-gray-200 cursor-pointer"
            >
              <img
                src={report.image?.url}
                alt="waste-image"
                className="w-full block md:hidden  md:w-60 h-30 sm:h-48 md:h-30 object-cover rounded-lg"
              />

              {/* RIGHT CONTENT */}
              <div className="w-full flex flex-col lg:flex-row md:justify-between  px-1 md:p-0 pb-1">
                <div className="flex-1 flex flex-col gap-3 lg:gap-5">
                  <p className="text-gray-800  font-medium text-base md:text-xl leading-snug">
                    <i className="fa-solid fa-location-dot text-gray-600 mr-2"></i>
                    <span>{report.location}</span>
                  </p>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 lg:gap-3 xl:gap-20 text-sm sm:text-lg text-gray-600">
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-trash-can"></i>
                      {report.wasteType}
                    </span>

                    <span className="flex items-center gap-2">
                      <i className="fa-regular fa-cloud"></i>
                      {report.quantity}
                    </span>

                    <span className="flex items-center gap-2">
                      <i className="fa-regular fa-calendar"></i>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between lg:items-end w-full lg:w-auto gap-2 md:gap-3 lg:gap-15 mt-2 lg:mt-0">
                  <div className="  flex flex-col lg:flex-row gap-2 lg:gap-4 lg:justify-end lg:items-center">
                    {report.status === "Completed" ? (
                      <span className="text-gray-600 text-xs sm:text-sm">
                        Completed at :{" "}
                        {new Date(report.completedAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    ) : report.status === "Delay" ? (
                      <span className="flex flex-row items-center text-xs sm:text-sm">
                        <span className="text-gray-600">
                          Expected Completion :
                        </span>
                        <span className="text-red-500 font-medium ms-1">
                          Overdue
                        </span>
                      </span>
                    ) : (
                      report.expectedCompletion && (
                        <span className="text-gray-600 text-xs sm:text-sm">
                          {formatExpectedCompletion(report.expectedCompletion)}
                        </span>
                      )
                    )}
                    <StatusBadge
                      status={report.status}
                      className="text-xs md:text-sm"
                    />
                  </div>

                  <div className="flex gap-2 md:gap-4 flex-col md:flex-row">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewUser(report.userId);
                      }}
                      className="text-sm px-3 py-1.5 rounded-lg border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition cursor-pointer"
                    >
                      View User
                    </button>

                    {report.status === "Assigned" &&
                      report.workerVerification?.status === "Pending" &&
                      (report.status !== "Delay" ||
                        report.previousStatus === "Assigned") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenConfirmWaste(report);
                          }}
                          className="bg-blue-500 text-white px-4 py-1.5 sm:py-2 rounded-lg cursor-pointer"
                        >
                          Confirm Waste
                        </button>
                      )}

                    {report.workerVerification?.status === "Waste Found" &&
                      report.status === "Assigned" &&
                      (report.status !== "Delay" ||
                        report.previousStatus === "Assigned") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(report._id, "In Process");
                          }}
                          className="px-4 py-2 w-full sm:w-auto rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition cursor-pointer"
                        >
                          Start Collection
                        </button>
                      )}

                    {(report.status === "In Process" ||
                      (report.status === "Delay" &&
                        report.previousStatus === "In Process")) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleStatusChange(report._id, "Completed");
                          setSelectedReportId(report._id);
                          setShowProofModal(true);
                        }}
                        className="px-4 py-1.5 md:py-2  rounded-lg bg-green-600 text-white hover:bg-green-700 transition cursor-pointer"
                      >
                        Verify & Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[95] p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setShowUserModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-base md:text-xl font-bold cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex flex-col items-center gap-2 md:gap-4">
              <img
                src={selectedUser.image || "/user.png"}
                alt={selectedUser.name}
                className="w-30 h-30 rounded-full object-cover border-2 border-gray-200"
              />
              <p className="text-xl font-semibold text-gray-800">
                {selectedUser.name || "Name"}
              </p>
              <p className="text-gray-600 text-sm">{selectedUser.email}</p>
              <p className="text-gray-600 text-sm">{selectedUser.phone}</p>

              {selectedUser.address && (
                <p className="text-gray-500 text-sm text-center mt-2">
                  {selectedUser.address.line1},{selectedUser.address.line2}
                </p>
              )}
            </div>

            <div className="sm:mt-6 flex justify-center flex-col md:flex-row gap-2 md:gap-4">
              <button
                className="w-full py-2 rounded-lg bg-blue-500 text-white text-sm md:text-base hover:bg-blue-600 transition cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(selectedUser.email);
                  toast.success("Email address copied!");
                }}
              >
                Copy Email
              </button>
              <button
                className="w-full py-2 rounded-lg bg-green-500 text-white text-sm md:text-base hover:bg-green-600 transition cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(selectedUser.phone);
                  toast.success("Phone number copied!");
                }}
              >
                Copy Phone
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmWasteModal && selectedReportForConfirmation && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[95] p-2 md:p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-4 md:p-6 relative">
            <h2 className="text-lg md:text-xl  font-semibold text-gray-800 mb-4">
              Confirm Waste Collection
            </h2>

            <p className="text-gray-700">
              Please Select an option{" "}
              <span className="text-red-500 font-medium text-lg">*</span>
            </p>

            <div className="flex flex-col gap-2 mt-2">
              <label className="flex text-sm md:text-base items-center gap-2 cursor-pointer text-gray-500">
                <input
                  type="radio"
                  name="verificationType"
                  value="Waste Found"
                  checked={workerVerificationType === "Waste Found"}
                  onChange={(e) => setWorkerVerificationType(e.target.value)}
                  className="accent-green-600"
                />
                Waste Found
              </label>

              <label className="flex text-sm md:text-base items-center gap-2 cursor-pointer text-gray-500">
                <input
                  type="radio"
                  name="verificationType"
                  value="Wrong Report"
                  checked={workerVerificationType === "Wrong Report"}
                  onChange={(e) => setWorkerVerificationType(e.target.value)}
                  className="accent-red-600"
                />
                Wrong Report
              </label>

              <label className="flex text-sm md:text-base items-center gap-2 cursor-pointer text-gray-500">
                <input
                  type="radio"
                  name="verificationType"
                  value="Already Cleaned"
                  checked={workerVerificationType === "Already Cleaned"}
                  onChange={(e) => setWorkerVerificationType(e.target.value)}
                  className="accent-red-600"
                />
                Already Cleaned
              </label>
            </div>

            {(workerVerificationType === "Wrong Report" ||
              workerVerificationType === "Already Cleaned") && (
              <textarea
                placeholder="Write note for admin..."
                value={workerVerificationNote}
                onChange={(e) => setWorkerVerificationNote(e.target.value)}
                className="w-full text-sm md:text-base border-2 border-gray-300 rounded-lg p-2 mt-3 text-gray-700
               transition-colors duration-300 ease-in-out 
               focus:outline-none focus:border-green-500"
              />
            )}

            <div className="flex gap-4 mt-3 md:mt-5">
              <button
                onClick={handleCloseConfirmWaste}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={!workerVerificationType || submitting} // disable if no option selected or submitting
                className={`px-4 py-2 rounded-lg text-white transition ${
                  !workerVerificationType
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 cursor-pointer"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Modal */}
      {showProofModal && selectedReportId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[95] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 sm:p-6 relative">
            <h2 className="text-base sm:text-xl font-semibold text-gray-500 mb-4 text-left sm:text-center">
              Upload Proof of Collection
            </h2>

            <button
              onClick={() => {
                setShowProofModal(false);
                setPreview(null);
                setImage(null);
                setVerified(false);
                setVerificationResult(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-base sm:text-xl font-bold cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex flex-col gap-4">
              <label className="w-full border-2 border-dashed border-green-400 rounded-xl p-2 md:p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImage(file);
                      setPreview(URL.createObjectURL(file));
                      e.target.value = null;
                    }
                  }}
                />
                {!preview ? (
                  <>
                    <i className="fa-solid fa-upload text-2xl sm:text-3xl md:text-4xl text-green-500 mb-3"></i>
                    <p className="text-green-600 font-medium text-sm md:text-lg mb-1">
                      Upload a file or drag & drop
                    </p>
                    <p className="text-gray-500 text-xs">PNG, JPG up to 10MB</p>
                  </>
                ) : (
                  <img
                    src={preview}
                    className="w-full max-h-60 object-cover rounded-lg"
                  />
                )}
              </label>

              {verificationResult && (
                <div className="p-4 border border-gray-300 rounded-xl bg-green-50 flex flex-col gap-2 shadow-sm">
                  {verified && (
                    <p className="text-green-700 font-semibold flex items-center gap-2 text-sm md:text-base">
                      <i className="fa-solid fa-check-circle"></i> Verified by
                      AI
                    </p>
                  )}

                  <p className="text-gray-800 font-medium text-sm md:text-base">
                    <span className="font-semibold text-gray-700">
                      Waste Type matched:
                    </span>{" "}
                    <span
                      className={`font-medium ${
                        verificationResult.wasteTypeMatched === "Yes"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {verificationResult.wasteTypeMatched}
                    </span>
                  </p>

                  <p className="text-gray-800 font-medium text-sm md:text-base">
                    <span className="font-semibold text-gray-700">
                      Quantity matched:
                    </span>{" "}
                    <span
                      className={`font-medium ${
                        verificationResult.quantityMatched === "Yes"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {verificationResult.quantityMatched}
                    </span>
                  </p>

                  <p className="text-gray-600 text-sm md:text-base">
                    <span className="font-semibold text-gray-700">
                      Similarity:
                    </span>{" "}
                    <span className="text-gray-700">
                      {verificationResult.similarity}%
                    </span>
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleVerify}
                  disabled={verifying || verified}
                  className={`flex-1 py-2 rounded-lg text-white transition cursor-pointer ${
                    verifying
                      ? "bg-blue-400 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {verifying ? (
                    <span className="flex items-center justify-center">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>{" "}
                      Verifying...
                    </span>
                  ) : verified ? (
                    <span className="flex items-center justify-center gap-1 cursor-not-allowed">
                      <i className="fa-solid fa-check-circle text-base"></i>{" "}
                      Verified
                    </span>
                  ) : (
                    "Verify"
                  )}
                </button>

                <button
                  onClick={handleComplete}
                  disabled={!verified || completing}
                  className={`flex-1 py-2 rounded-lg text-white transition ${
                    !verified
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 cursor-pointer"
                  }`}
                >
                  {completing ? (
                    <span className="flex items-center justify-center">
                      <i className="fa-solid fa-spinner fa-spin mr-1"></i>
                      completing...
                    </span>
                  ) : (
                    "Complete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignReports;
