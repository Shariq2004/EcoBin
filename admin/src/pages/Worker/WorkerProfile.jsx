import React, { useContext, useEffect, useState } from "react";
import { WorkerContext } from "../../context/WorkerContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Map,
  CheckCircle,
  Clock,
  Edit,
} from "lucide-react";
import StatusBadge from "../../component/StatusBadge";

const WorkerProfile = () => {
  const { wToken, profileData, getProfileData, updateWorkerProfile } =
    useContext(WorkerContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: { street: "", city: "" },
  });

  useEffect(() => {
    if (wToken) getProfileData();
  }, [wToken]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        phone: profileData.phone || "",
        street: profileData.address?.street || "",
        city: profileData.address?.city || "",
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const form = new FormData();

    form.append("name", formData.name);
    form.append("phone", formData.phone);
    form.append(
      "address",
      JSON.stringify({
        street: formData.street,
        city: formData.city,
      }),
    );

    if (image) form.append("image", image);

    const success = await updateWorkerProfile(form);

    if (success) setIsEdit(false);
  };

  if (!profileData) return null;

  return (
    profileData && (
      <div className="py-3 sm:py-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
          My profile
        </h1>

        <div className="flex flex-col gap-4">
          {/* top card */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-6 rounded-2xl shadow-md w-full">
            <div className="relative">
              {isEdit ? (
                <label htmlFor="image" className="cursor-pointer inline-block">
                  <img
                    src={image ? URL.createObjectURL(image) : profileData.image}
                    alt={profileData.name}
                    className="w-32 h-32 md:w-44 md:h-44 rounded-full object-cover opacity-80 hover:opacity-100 transition bg-green-50"
                  />
                  <div className="absolute bottom-4 right-1 sm:right-4 bg-green-500 h-8 w-8 rounded-full flex items-center justify-center hover:bg-green-600 transition">
                    <i class="fa-solid fa-cloud-arrow-up text-white"></i>
                  </div>
                  <input
                    type="file"
                    id="image"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
              ) : (
                <img
                  src={profileData.image}
                  alt={profileData.name}
                  className="w-32 h-32 md:w-44 md:h-44 rounded-full object-cover bg-gray-100"
                />
              )}
              {/* Active Dot */}
              {isEdit || !profileData.isActive ? null : (
                <span className="absolute bottom-5 right-1 md:right-3 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>

            {/* Name & Edit Button */}
            <div className="flex-1 flex flex-col justify-center items-center md:items-start gap-3 sm:gap-5 w-full md:w-auto">
              {isEdit ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-xl w-full sm:w-1/2  xl:w-1/2 md:text-3xl font-medium bg-gray-100 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  {profileData.name}
                </h1>
              )}

              <div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Availability:</span>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium
                     ${
                       profileData.isActive
                         ? "bg-green-100 text-green-600"
                         : "bg-red-100 text-red-600"
                     }`}
                  >
                    {profileData.isActive ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-1 sm:gap-4 mt-2">
                {isEdit ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="sm:mt-2 px-4 py-1 sm:px-6 sm:py-2 border border-green-500 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition-all font-medium shadow-sm cursor-pointer"
                    >
                      Save Information
                    </button>
                    <button
                      onClick={() => setIsEdit(false)}
                      className="mt-2  px-6 py-1 sm:py-2 bg-gray-300 rounded-full cursor-pointer font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="text-sm sm:text-base flex items-center gap-2 w-full sm:w-auto px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer"
                  >
                    <Edit size={18} /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="relative bg-white/80 backdrop-blur-lg border border-gray-100 rounded-3xl shadow-lg transition-all duration-300 p-6 ">
            <h2 className="text-lg font-semibold text-green-600 mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <span className="font-medium">Email</span>
                <span className="text-gray-500">{profileData.email}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-medium">Phone</span>
                {isEdit ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">
                    {profileData.phone}
                  </span>
                )}
              </div>

              <div>
                <p className="text-base">Zone</p>
                <p className="text-sm font-medium text-gray-500 capitalize">
                  {profileData.zone?.name}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-medium">Address</span>
                {isEdit ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span>Sreet:</span>{" "}
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        placeholder="Street"
                        onChange={handleChange}
                        className="w-full bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <span>City:</span>{" "}
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        placeholder="City"
                        onChange={handleChange}
                        className="w-full bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500">
                    {profileData.address?.street}, {profileData.address?.city}
                  </span>
                )}
              </div>

              <div>
                <p>Areas</p>
                <p className="text-base font-medium text-gray-500">
                  {profileData.zone?.areas?.join(", ")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span>Status:</span>

                <StatusBadge status={profileData.status} className="text-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default WorkerProfile;
