import React, { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddWorker = () => {
  const [workImg, setWorkImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zones, setZones] = useState([]);
  const [zone, setZone] = useState(" ");
  const [addingWorker, setAddingWorker] = useState(false);
  const navigate = useNavigate();

  const { backendUrl, aToken, workers, setWorkers } = useContext(AdminContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setAddingWorker(true);

    try {
      if (!workImg) {
        toast.error("Image Not Selected");
        setAddingWorker(false);
        return;
      }

      const formData = new FormData();

      formData.append("image", workImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", Number(phone));
      formData.append("zone", zone);
      formData.append(
        "address",
        JSON.stringify({ street: street, city: city }),
      );

      formData.forEach((value, key) => {
        console.log(`${key}:${value}`);
      });

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-worker",
        formData,
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success(data.message);
        setWorkImg(false);
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setStreet("");
        setCity("");

        setWorkers((prev) => [...(prev || []), data.worker]);

        navigate("/worker-list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setAddingWorker(false);
    }
  };

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const { data } = await axios.get(backendUrl + "/api/zones");

        if (data.success) {
          setZones(data.zones);
        }
      } catch (error) {
        console.log("Error fetching zones:", error);
      }
    };

    fetchZones();
  }, []);

  return (
    <div className="py-4 sm:py-7">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-5">
        Add Worker
      </h1>

      <div className="bg-white shadow-md rounded-2xl p-8 max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="work-img">
            <img
              src={workImg ? URL.createObjectURL(workImg) : assets.upload_area}
              alt=""
              className="w-15 md:w-25  bg-gray-100 rounded-full cursor-pointer"
            />
          </label>
          <input
            onChange={(e) => setWorkImg(e.target.files[0])}
            type="file"
            id="work-img"
            hidden
          />
          <p>
            Upload Worker <br /> image
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter worker name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-medium">Zone</label>
            <select
              name="zone"
              onChange={(e) => setZone(e.target.value)}
              value={zone}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              required
            >
              <option value="">Select Zone</option>
              {zones?.map((z) => (
                <option key={z._id} value={z._id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="mb-2 text-gray-700 font-medium">Address</label>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="address.street"
                placeholder="Enter street"
                onChange={(e) => setStreet(e.target.value)}
                value={street}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                required
              />
              <input
                type="text"
                name="address.city"
                placeholder="Enter city"
                onChange={(e) => setCity(e.target.value)}
                value={city}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={addingWorker}
              className={`font-semibold text-base px-6 py-2 rounded-lg shadow-md transition duration-300 w-full flex justify-center items-center
                ${
                  addingWorker
                    ? "bg-green-400 text-white cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                }`}
            >
              {addingWorker ? (
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin"></i> Adding...
                </span>
              ) : (
                "Add Worker"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorker;
