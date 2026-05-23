import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import useClickOutside from "../hooks/useClickOutside";

export default function ReportWaste() {
  const {
    backendUrl,
    token,
    loading,
    setLoading,
    reports,
    setReports,
    fetchImpact,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [location, setLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity] = useState("");

  const [aiResult, setAiResult] = useState(null);

  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isAIData, setIsAIData] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [areas, setAreas] = useState([]);
  const dropdownRef = useRef();

  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setIsVerified(false);
    }
  };

  const filteredAreas = searchTerm
    ? areas.filter((area) =>
        area.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : areas;

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setIsVerified(false);
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

  useEffect(() => {
    if (reports.length === 0) fetchReports();
  }, [token]);

  const handleVerify = async () => {
    if (!image) return toast.error("Please upload an image");

    setLoadingVerify(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/report/verify",
        formData,
        {
          headers: {
            token,
          },
        },
      );

      if (!data.success) {
        setLoadingVerify(false);
        return toast.error(data.error || "Invalid waste image");
      }

      toast.success("Waste successfully Verified!");
      console.log(data);

      if (data.verificationToken) {
        localStorage.setItem("verificationToken", data.verificationToken);
      }

      setWasteType(data.wasteType);
      setQuantity(data.quantity);

      setAiResult({
        wasteType: data.wasteType,
        quantity: data.quantity,
        confidence: data.confidence,
      });

      setIsAIData(true);
      setIsVerified(true);
    } catch (error) {
      toast.error(error.response?.data?.error || "Verification failed");
    }

    setLoadingVerify(false);
  };

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Login first to submit report");
      return navigate("/login");
    }

    if (!isVerified) {
      return toast.error("Please verify the image first");
    }

    if (!image || !location || !wasteType || !quantity) {
      return toast.error("Please fill all fields");
    }

    setLoadingSubmit(true);

    try {
      const formData = new FormData();

      formData.append("location", location);
      formData.append("wasteType", wasteType);
      formData.append("quantity", quantity);
      formData.append("image", image);

      formData.append(
        "verificationToken",
        localStorage.getItem("verificationToken"),
      );

      const { data } = await axios.post(
        backendUrl + "/api/report/create",
        formData,
        {
          headers: {
            token,
          },
        },
      );

      if (data.success) {
        toast.success("Report submitted successfully!");

        setLocation("");
        setWasteType("");
        setQuantity("");
        setImage(null);
        setPreview(null);
        setAiResult(null);
        setIsVerified(false);
        setIsAIData(false);
        localStorage.removeItem("verificationToken");

        fetchReports(); //refresh reports
        fetchImpact();
        navigate("/my-request");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    }

    setLoadingSubmit(false);
  };

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const { data } = await axios.get(backendUrl + "/api/zones");

        if (data?.success && Array.isArray(data.zones)) {
          console.log(data.zones);

          // Sab zones ke areas ko ek flat array me convert karo
          const allAreas = data.zones.flatMap((zone) => zone.areas || []);

          setAreas(allAreas);
          console.log("All Areas:", allAreas);
        }
      } catch (error) {
        console.log("Error fetching zones:", error);
      }
    };

    fetchZones();
  }, []);

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 1024); // mobile + tablet
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F5FBF9] px-5 sm:px-9 lg:px-[9%] pt-20 md:pt-24 pb-10 md:pb-20">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-medium md:font-semibold text-gray-800 mb-3 md:mb-6">
        Report Waste
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow">
          <h2 className="text-base sm:text-lg md:text-xl font-medium mb-4 text-gray-600">
            Upload Waste Image
          </h2>

          {/* UPLOAD BOX */}
          <label
            className={`w-full border-2 border-dashed rounded-xl p-2 md:p-4 flex flex-col items-center justify-center cursor-pointer transition
            ${dragActive ? "border-green-600 bg-green-100" : "border-green-400 hover:bg-green-50"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImage}
              className="hidden"
            />

            {!preview ? (
              <>
                <i className="fa-solid fa-upload text-2xl sm:text-3xl md:text-4xl text-green-500 mb-3"></i>

                <p className="text-green-600 text-sm md:text-lg mb-1 text-center">
                  {dragActive ? "Drop here..." : "Upload a file or drag & drop"}
                </p>

                <p className="text-gray-500 text-xs">PNG, JPG up to 10MB</p>
              </>
            ) : (
              <img
                src={preview}
                className="w-full max-h-60 object-cover rounded-lg"
                alt="preview"
              />
            )}
          </label>

          <button
            onClick={handleVerify}
            disabled={!image || loadingVerify || isVerified}
            className={`w-full mt-4 sm:mt-6 py-1.5 sm:py-2 text-base sm:text-lg rounded-lg font-medium sm:font-semibold transition ${
              !image
                ? "bg-blue-300 text-white cursor-not-allowed"
                : loadingVerify
                  ? "bg-blue-400 text-white cursor-not-allowed"
                  : isVerified
                    ? "bg-blue-500 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            }`}
          >
            {loadingVerify ? (
              <span className="flex items-center justify-center">
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>{" "}
                Verifying...
              </span>
            ) : isVerified ? (
              <span className="flex items-center justify-center gap-1 sm:gap-2">
                <i className="fa-regular fa-check-circle text-xl sm:text-2xl"></i> Verified
              </span>
            ) : (
              "Verify Waste"
            )}
          </button>

          {aiResult && (
            <div className="flex items-center gap-2 sm:gap-5 mt-4 sm:mt-6 p-2 bg-green-100 border border-green-500 rounded-xl border-l-3 sm:border-l-6">
              <div>
                <i className="fa-regular fa-check-circle text-xl sm:text-3xl  text-green-600"></i>
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-semibold text-green-700">
                  AI Verification Successfull
                </h3>
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-8 pt-6 pb-6 rounded-xl">
            <h3 className="font-medium text-lg md:text-xl mb-4 sm:mb-7 text-gray-600">
              Waste Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative w-full" ref={dropdownRef}>
                <label className="font-medium text-gray-700">Location</label>
                <div
                  onClick={() => {
                    setIsOpen(true);
                    setSearchTerm(location);
                  }}
                  className="w-full border-2 border-gray-300 p-1.5 md:p-2.5 mt-1 rounded-lg cursor-pointer focus-within:border-green-500"
                >
                  <input
                    type="text"
                    value={isOpen ? searchTerm : location}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setLocation(e.target.value);
                      setIsOpen(true);
                      setHighlightIndex(-1);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={(e) => {
                      if (!isOpen) return;

                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setHighlightIndex((prev) =>
                          prev < filteredAreas.length - 1 ? prev + 1 : 0,
                        );
                      }

                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setHighlightIndex((prev) =>
                          prev > 0 ? prev - 1 : filteredAreas.length - 1,
                        );
                      }

                      if (e.key === "Enter" && highlightIndex >= 0) {
                        e.preventDefault();
                        const selected = filteredAreas[highlightIndex];
                        setLocation(selected);
                        setSearchTerm(selected);
                        setIsOpen(false);
                        setHighlightIndex(-1);
                      }

                      if (e.key === "Escape") {
                        setIsOpen(false);
                      }
                    }}
                    placeholder="Select only by dropdown"
                    className="w-full outline-none bg-transparent"
                  />
                </div>

                {/* Dropdown */}
                <div
                  className={`absolute left-0 right-0 mt-1 sm:mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto transition-all duration-300 ${
                    isOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  {filteredAreas.length > 0 ? (
                    filteredAreas.map((area, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setLocation(area);
                          setSearchTerm(area);
                          setIsOpen(false);
                          setHighlightIndex(-1);
                        }}
                        className={`p-2 cursor-pointer ${
                          index === highlightIndex
                            ? "bg-green-200"
                            : "hover:bg-green-100"
                        }`}
                      >
                        <i className="fa-solid fa-location-dot text-green-500 mr-2"></i>{" "}
                        {area}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500 text-center">
                      No area found
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-700">Waste Type</label>
                <input
                  value={wasteType}
                  onChange={(e) => setWasteType(e.target.value)}
                  placeholder="Waste type"
                  className={`w-full text-sm sm:text-base border-2 border-gray-300 p-2 sm:p-2.5 mt-1 rounded-lg outline-none focus:border-green-500 ${isAIData ? "bg-green-50" : "bg-white"}`}
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">
                  Estimated Amount
                </label>
                <input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Estimated amount"
                  className={`w-full text-sm sm:text-base bg-green-50 border-2 border-gray-300 p-2 sm:p-2.5 mt-1 rounded-lg outline-none focus:border-green-500 ${isAIData ? "bg-green-50" : "bg-white"}`}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loadingSubmit}
              className={`w-full mt-8 py-1.5 sm:py-2 text-base sm:text-lg rounded-lg font-semibold transition ${
                loadingSubmit
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
              }`}
            >
              {loadingSubmit ? (
                <span className="flex items-center justify-center">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>{" "}
                  Submitting...
                </span>
              ) : (
                "Submit Report"
              )}
            </button>
          </div>
        </div>

        {/* REPORT LIST */}
        <div className="bg-white rounded-2xl shadow-lg max-h-[700px] h-full flex flex-col border-t-3 border-green-500">
          <div className="px-4 sm:px-6 py-4">
            <h2 className="font-medium text-lg md:text-xl text-gray-600">
              Recent Reports
            </h2>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="min-w-[600px] w-full">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="ps-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="2" className="py-40">
                      <Loader />
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="py-20 sm:py-50 text-center text-gray-500 text-base md:text-lg"
                    >
                      No reports created yet
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr
                      key={report._id}
                      className="hover:bg-gray-50 transition cursor-pointer border-b border-gray-200"
                    >
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 flex items-center whitespace-nowrap">
                        <i className="fa-solid fa-location-dot text-green-500 mr-2"></i>
                        {report.location}
                      </td>
                      <td className="pe-1 py-4 text-sm whitespace-nowrap">
                        <span className="text-green-700 px-3 py-1 text-sm font-medium">
                          {report.wasteType}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
