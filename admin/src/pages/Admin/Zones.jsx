import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { AdminContext } from "../../context/AdminContext";
import Loader from "../../component/Loader";

const Zones = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { aToken, getAllZones, zones, setZones } = useContext(AdminContext);
  const { loading, setLoading } = useContext(AppContext);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [zoneName, setZoneName] = useState("");
  const [areaInput, setAreaInput] = useState("");
  const [areas, setAreas] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(null);

  // FETCH ZONES
  const fetchZones = async () => {
    if (aToken) {
      if (zones && zones.length > 0) return;

      setLoading(true);
      await getAllZones();
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, [aToken]);

  const handleAddArea = () => {
    if (!areaInput.trim()) {
      return toast.error("Area required");
    }

    const formattedArea = areaInput.trim().toLowerCase();

    if (areas.includes(formattedArea)) {
      return toast.error("Duplicate area not allowed");
    }

    setAreas([...areas, formattedArea]);
    setAreaInput("");
  };

  const handleRemoveArea = (index) => {
    const updated = [...areas];
    updated.splice(index, 1);
    setAreas(updated);
  };

  const resetForm = () => {
    setShowModal(false);
    setZoneName("");
    setAreas([]);
    setAreaInput("");
    setEditMode(false);
    setSelectedZoneId(null);
  };

  const handleEditClick = (zone) => {
    setEditMode(true);
    setSelectedZoneId(zone._id);
    setZoneName(zone.name);
    setAreas(zone.areas);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!zoneName.trim()) {
      return toast.error("Zone name required");
    }

    if (areas.length === 0) {
      return toast.error("Add at least one area");
    }

    try {
      const formattedZone = zoneName.trim().toLowerCase();

      if (editMode) {
        // UPDATE
        const { data } = await axios.put(
          backendUrl + `/api/admin/update-zone/${selectedZoneId}`,
          {
            name: formattedZone,
            areas,
          },
          { headers: { aToken } },
        );

        if (data.success) {
          toast.success("Zone updated successfully");

          setZones((prev) =>
            prev.map((z) =>
              z._id === selectedZoneId
                ? { ...z, name: formattedZone, areas }
                : z,
            ),
          );
        } else {
          toast.error(data.message);
          return;
        }
      } else {
        const { data } = await axios.post(
          backendUrl + "/api/admin/add-zone",
          {
            name: formattedZone,
            areas,
          },
          { headers: { aToken } },
        );

        if (data.success) {
          toast.success("Zone added successfully");

          setZones((prev) => [
            ...prev,
            { _id: data.zone._id, name: formattedZone, areas },
          ]);
        } else {
          toast.error(data.message);
          return;
        }
      }

      resetForm();
      fetchZones();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDeleteZone = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this zone?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(
        backendUrl + `/api/admin/delete-zone/${id}`,
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success("Zone deleted successfully");

        setZones((prev) => prev.filter((zone) => zone._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const filteredZones = zones.filter((zone) =>
    zone.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="py-4 sm:py-7">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-5">
        Manage Zones & Areas
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mb-6">
        <div className="flex-1 bg-white rounded-full shadow-md flex items-center px-4 py-2 md:py-3 border border-gray-200">
          <i className="fa-solid fa-magnifying-glass text-gray-500 text-sm md:text-base mr-2"></i>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search zone..."
            className="w-full outline-none text-sm md:text-base text-gray-700"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium md:font-semibold transition-all sm:w-auto w-full cursor-pointer"
        >
        <i class="fa-solid fa-plus"></i> Add Zone
        </button>
      </div>

      <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Zone</th>
                <th className="px-6 py-4  font-bold">Areas</th>
                <th className="px-6 py-4 text-center font-bold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading && zones.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-30 text-center text-gray-500">
                    <Loader />
                  </td>
                </tr>
              ) : filteredZones.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-400">
                    No Zones Found
                  </td>
                </tr>
              ) : (
                filteredZones.map((zone) => (
                  <tr
                    key={zone._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-600 capitalize">
                      {zone.name}
                    </td>

                    <td className="px-3 lg:px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {zone.areas.map((area, index) => (
                          <span
                            key={index}
                            className="bg-green-50 text-green-700 text-xs lg:text-sm px-3 py-1 rounded-full font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEditClick(zone)}
                          className="px-3 py-1 text-xs md:text-sm font-medium bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteZone(zone._id)}
                          className="px-3 py-1 text-xs md:text-sm font-medium bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading...</div>
        ) : filteredZones.length === 0 ? (
          <div className="text-center text-gray-400 py-6">No Zones Found</div>
        ) : (
          filteredZones.map((zone) => (
            <div
              key={zone._id}
              className="bg-white rounded-xl shadow p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 capitalize">
                  {zone.name}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {zone.areas.map((area, index) => (
                  <span
                    key={index}
                    className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>

              <div className="flex  gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleEditClick(zone)}
                  className="px-3 py-1 text-xs md:text-sm font-medium bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteZone(zone._id)}
                  className="px-3 py-1 text-xs md:text-sm font-medium bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL  */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm  bg-opacity-50 flex justify-center items-center z-100">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px]">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Zone Details" : "Add Zone Details"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter zone name"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                className="border-2 border-gray-300 rounded-lg outline-none text-gray-700 p-2  w-full mb-4 focus:border-green-500"
              />

              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Enter area"
                  value={areaInput}
                  onChange={(e) => setAreaInput(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg outline-none text-gray-700 p-2 pr-20 w-full focus:border-green-500"
                />

                <button
                  type="button"
                  onClick={handleAddArea}
                  className="absolute right-1 top-1 bottom-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 rounded-md transition cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="mb-4">
                {areas.map((area, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-green-500 bg-green-50 p-2 rounded mb-2"
                  >
                    <span>{area}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveArea(index)}
                      className="text-red-600 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-full cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-green-600 text-white px-5 py-2 rounded-full cursor-pointer"
                >
                  {editMode ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Zones;
