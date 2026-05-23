import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";
import Loader from "../../component/Loader";
import StatusBadge from "../../component/StatusBadge";

const WorkerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { aToken, workers, setWorkers, backendUrl } = useContext(AdminContext);

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWorker = async () => {
    if (!id || !aToken) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/worker/${id}`, {
        headers: { aToken },
      });

      if (data.success) setWorker(data.worker);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message || "Failed to fetch worker");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this worker?")) return;

    console.log(id);
    try {
      await axios.delete(backendUrl + `/api/admin/worker/${id}`, {
        headers: { aToken },
      });
      toast.success("Worker deleted");
      setWorkers((prev) => prev.filter((worker) => worker._id !== id));
      navigate("/worker-list");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchWorker();
  }, [id]);

  if (loading && !worker)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader />
      </div>
    );

  if (!worker && !loading)
    return (
      <p className="text-center text-gray-500 mt-10">No worker data found</p>
    );

  return (
    <div className="py-4 sm:py-7">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
          Worker Details
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
        >
          <i class="fa-solid fa-arrow-left"></i> Back
        </button>
      </div>

      {/* Worker Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row gap-8 p-6">
        <div className="flex-shrink-0 flex justify-center md:justify-start">
          <img
            src={worker.image || "/default-user.png"}
            alt={worker.name}
            className="w-40 h-40 rounded-full object-cover border-4 border-green-100 bg-gray-100 shadow-sm"
          />
        </div>

        {/* Worker Info */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Name</p>
              <p className="font-semibold text-gray-800">{worker.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="font-semibold text-gray-800">{worker.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Phone</p>
              <p className="font-semibold text-gray-800">{worker.phone}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <StatusBadge status={worker.status} className="text-xs" />
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Zone</p>
              <p className="text-green-600 text-xs w-fit px-2 py-1 bg-green-100 rounded-full capitalize">
                {worker.zone?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Tasks Completed</p>
              <p className="font-semibold text-gray-800">
                {worker.totalTasksCompleted || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Current Task</p>
              <p className="font-semibold text-gray-800">
                {worker.currentTask?.reportId || "No Active Task"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Account Created</p>
              <p className="font-semibold text-gray-800">
                {new Date(worker.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Address</p>
            <p className="font-medium text-gray-800">
              {worker.address?.street || "N/A"}, {worker.address?.city || ""}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white hover:bg-red-700 transition cursor-pointer"
            >
              Delete Worker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetail;
