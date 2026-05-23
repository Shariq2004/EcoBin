import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="w-full min-h-screen  px-5 sm:px-9 lg:px-[9%] pt-20 md:pt-26 pb-15 bg-[#F5FBF9]">
        <h1 className="text-2xl md:text-3xl font-medium md:font-semibold text-gray-800 mb-3 md:mb-5">
          My Profile
        </h1>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-6 rounded-2xl shadow-md w-full">
            <div className="relative">
              {isEdit ? (
                <label htmlFor="image" className="cursor-pointer inline-block">
                  <img
                    className="w-36 h-36 rounded-full object-cover opacity-80 hover:opacity-100 transition"
                    src={image ? URL.createObjectURL(image) : userData.image}
                    alt="profile"
                  />

                  <div className="absolute bottom-3 right-3 bg-green-500 h-10 w-10 rounded-full shadow-md hover:bg-green-600 transition flex items-center justify-center">
                    <i class="fa-solid fa-upload text-base text-white"></i>
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
                  className="w-36 h-36 rounded-full object-cover"
                  src={userData.image}
                  alt="profile"
                />
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center items-center md:items-start gap-3 w-full md:w-auto">
              {isEdit ? (
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="text-xl w-full sm:w-1/2 md:text-3xl font-medium bg-gray-100 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  {userData.name}
                </h1>
              )}

              <button
                onClick={() => {
                  isEdit ? updateUserProfileData() : setIsEdit(true);
                }}
                className="mt-1 sm:mt-2 w-max px-3 py-1 sm:px-6 sm:py-2 border border-green-500 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition-all font-medium shadow-sm cursor-pointer"
              >
                {isEdit ? "Save Information" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Bottom Layout */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Contact Information Card - Left side */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-gray-700">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Email</span>
                  <span className="text-green-500">{userData.email}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-medium">Phone</span>
                  {isEdit ? (
                    <input
                      type="text"
                      value={userData.phone}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  ) : (
                    <span className="text-green-500">{userData.phone}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-medium">Address</span>
                  {isEdit ? (
                    <div className="flex flex-col gap-1">
                      Street:
                      <input
                        type="text"
                        value={userData.address.line1}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line1: e.target.value },
                          }))
                        }
                        className="bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                      City:
                      <input
                        type="text"
                        value={userData.address.line2}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line2: e.target.value },
                          }))
                        }
                        className="bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-500">
                      Street: {userData.address.line1}
                      <br />
                      City: {userData.address.line2}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information Card - Right side*/}
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 gap-4 text-gray-700">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Gender</span>
                  {isEdit ? (
                    <select
                      value={userData.gender}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className="bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <span className="text-gray-500">{userData.gender}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-medium">Birthday</span>
                  {isEdit ? (
                    <input
                      type="date"
                      value={userData.dob}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          dob: e.target.value,
                        }))
                      }
                      className="bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  ) : (
                    <span className="text-gray-500">{userData.dob}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;
