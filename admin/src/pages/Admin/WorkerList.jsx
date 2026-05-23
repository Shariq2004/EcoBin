import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { Link } from "react-router-dom";
import StatusBadge from "../../component/StatusBadge";
import Loader from "../../component/Loader";
import { AppContext } from "../../context/AppContext";

const WorkerList = () => {
  const { workers, aToken, getAllWorkers, ChangeAvailability } =
    useContext(AdminContext);
  const { loading, setLoading } = useContext(AppContext);

  useEffect(() => {
    const fetchWorker = async () => {
      if (aToken) {
        setLoading(true);
        await getAllWorkers();
        setLoading(false);
      }
    };
    fetchWorker();
  }, [aToken]);

  return (
    <div className="py-4 sm:py-7 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-5">
        All Workers
      </h1>
      <div className="w-full flex flex-wrap gap-4 gap-y-6">
        {loading ? (
          <div className="w-full flex justify-center py-50">
            <Loader />
          </div>
        ) : workers && workers.length > 0 ? (
          (workers || []).filter(Boolean).map((item, index) => (
            <div
              key={index}
              className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden group"
            >
              <Link to={`/worker/${item._id}`}>
                {" "}
                <img
                  className="bg-indigo-50 group-hover:bg-green-200  transition-all duration-500 cursor-pointer"
                  src={item.image}
                  alt=""
                />{" "}
              </Link>
              <div className="p-4">
                <div className="flex items-center justify-between gap-1 ">
                  <p className="text-neutral-800 text-lg font-medium">
                    {item.name}
                  </p>

                  {(item.status === "Available" || item.status === "UnAvailable") && (
                    <div className="relative inline-block">
                      <input
                        onChange={() => ChangeAvailability(item._id)}
                        type="checkbox"
                        checked={item.isActive}
                        className="cursor-pointer peer"
                      />

                      <span
                        className="absolute -top-7 -left-[43px] -translate-x-1/2
                        bg-gray-800 text-white text-xs px-2 py-1 rounded
                         opacity-0 peer-hover:opacity-100
                        transition-all duration-200 whitespace-nowrap pointer-events-none"
                      >
                        Toggle Availability
                        <span
                          className="absolute right-1 -bottom-1 w-2 h-2 
                          bg-gray-800 rotate-45"
                        ></span>
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between gap-1 text-sm">
                  <StatusBadge status={item.status} className="text-xs" />
                  <p className="text-gray-600 text-xs  px-2 py-1 bg-gray-200 rounded-full capitalize">
                    {item.zone?.name}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="w-full text-center py-25 md:py-50 text-lg md:text-xl text-gray-500">
            No workers added yet
          </p>
        )}
      </div>
    </div>
  );
};

export default WorkerList;
