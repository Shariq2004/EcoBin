import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Settings = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const [loading, setLoading] = useState(false);

  const [showRuleModal, setShowRuleModal] = useState(false);

  const [showWasteModal, setShowWasteModal] = useState(false);

  const [newWaste, setNewWaste] = useState({
    wasteType: "",
    points: "",
  });

  const addWasteType = async () => {
    try {
      if (!newWaste.wasteType.trim()) {
        toast.error("Please enter waste type");
        return;
      }

      if (newWaste.points === "") {
        toast.error("Please enter reward points");
        return;
      }

      if (!newWaste.wasteType.trim() && newWaste.points === "") {
        toast.error("Please enter waste type and points");
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/settings/waste-type/add",
        {
          wasteType: newWaste.wasteType,
          points: Number(newWaste.points),
        },
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        toast.success("Waste type added");

        setWasteRewards(data.rewardPointsByWasteType);

        setNewWaste({
          wasteType: "",
          points: "",
        });

        setShowWasteModal(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add waste type");
    }
  };

  const deleteWasteType = async (wasteType) => {
    try {
      const { data } = await axios.delete(
        backendUrl + "/api/settings/waste-type/delete",
        {
          data: { wasteType },
          headers: { aToken },
        },
      );

      if (data.success) {
        toast.success("Waste type deleted");

        setWasteRewards(data.rewardPointsByWasteType);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete waste type");
    }
  };

  const [newRule, setNewRule] = useState({
    minKg: "",
    maxKg: "",
    hours: "",
  });

  const [settings, setSettings] = useState({
    pointToRupeeRate: "",
    minRedeemPoints: "",
    maxRedeemPerDay: "",
  });

  const [wasteRewards, setWasteRewards] = useState({});

  const [completionTimes, setCompletionTimes] = useState({
    "Plastic waste": "",
    "Organic waste": "",
    "Paper waste": "",
    "Metal waste": "",
    "Glass waste": "",
    "Mixed waste": "",
    "Dry waste": "",
    "Wet waste": "",
  });

  const [completionRules, setCompletionRules] = useState([
    { minKg: 0, maxKg: 10, hours: 2 },
    { minKg: 10, maxKg: 30, hours: 6 },
  ]);

  const [showTime, setShowTime] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/settings/get", {
        headers: { aToken },
      });

      if (data.success && data.settings) {
        setSettings({
          pointToRupeeRate: data.settings.points?.pointToRupeeRate || "",
          minRedeemPoints: data.settings.points?.minRedeemPoints || "",
          maxRedeemPerDay: data.settings.points?.maxRedeemPerDay || "",
        });

        setWasteRewards(data.settings.rewardPointsByWasteType || {});

        setCompletionRules(
          data.settings.expectedCompletionByQuantity || [
            { minKg: 0, maxKg: 10, hours: 2 },
            { minKg: 10, maxKg: 30, hours: 6 },
            { minKg: 30, maxKg: 100, hours: 24 },
            { minKg: 100, maxKg: 10000, hours: 48 },
          ],
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load settings");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleWasteChange = (e) => {
    const value = e.target.value;

    setWasteRewards({
      ...wasteRewards,
      [e.target.name]: value === "" ? "" : Number(value),
    });
  };

  const handleTimeChange = (e) => {
    setCompletionTimes({
      ...completionTimes,
      [e.target.name]: e.target.value,
    });
  };

  const handleMinKgChange = (value, index) => {
    const updated = [...completionRules];
    updated[index].minKg = value === "" ? "" : Number(value);
    setCompletionRules(updated);
  };

  const handleMaxKgChange = (value, index) => {
    const updated = [...completionRules];
    updated[index].maxKg = value === "" ? "" : Number(value);
    setCompletionRules(updated);
  };

  const handleHoursChange = (value, index) => {
    const updated = [...completionRules];
    updated[index].hours = value === "" ? "" : Number(value);
    setCompletionRules(updated);
  };

  const handleSave = async () => {
    if (!aToken) {
      toast.error("Unauthorized access");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        backendUrl + "/api/settings/update",
        {
          ...settings,
          rewardPointsByWasteType: wasteRewards,
          expectedCompletionByQuantity: completionRules,
          showExpectedCompletionTime: showTime,
        },
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        toast.success("Changes Updated Successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShowTime = async (e) => {
    const checked = e.target.checked;
    setShowTime(checked);

    try {
      const { data } = await axios.put(
        backendUrl + "/api/settings/update",
        {
          showExpectedCompletionTime: checked,
        },
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        if (checked) {
          toast.success("Expected completion time is now visible");
        } else {
          toast.info("Expected completion time is hidden");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update setting");
    }
  };

  const addRule = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/settings/completion-rules/add",
        {
          minKg: Number(newRule.minKg),
          maxKg: Number(newRule.maxKg),
          hours: Number(newRule.hours),
        },
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        toast.success(data.message);
        setCompletionRules(data.rules);
        setShowRuleModal(false);

        setNewRule({
          minKg: "",
          maxKg: "",
          hours: "",
        });
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const deleteRule = async (index) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/settings/completion-rules/delete",
        { index },
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        setCompletionRules(data.rules);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete rule");
    }
  };

  return (
    <div className="py-7 w-full min-h-screen bg-gray-50">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
        Settings
      </h1>

      {/*  WASTE REWARD SYSTEM  */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-2">
          <h2 className="font-medium text-lg text-gray-600">
            Report Completion Reward for User (Ecobin Points)
          </h2>

          <button
            onClick={() => setShowWasteModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            + Add Waste Type
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(wasteRewards).map((type, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-600">
                  {type}
                </label>

                <div className="relative group inline-block">
                  <button
                    onClick={() => deleteWasteType(type)}
                    className="text-gray-500 hover:text-gray-800 cursor-pointer rounded"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>

                  {/* Tooltip */}
                  <span
                    className="absolute -top-8 left-1/2 -translate-x-1/2 
                    bg-gray-800 text-white text-xs px-2 py-1 rounded
                    opacity-0 group-hover:opacity-100
                    transition-all duration-200 whitespace-nowrap"
                  >
                    Delete
                    {/* Arrow */}
                    <span
                      className="absolute left-1/2 -bottom-1 w-2 h-2 
                      bg-gray-800 rotate-45 -translate-x-1/2"
                    ></span>
                  </span>
                </div>
              </div>

              <input
                type="number"
                name={type}
                value={wasteRewards[type]}
                onChange={handleWasteChange}
                placeholder="Enter points"
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />

              <p className="text-xs text-gray-400 mt-1">
                Reward points for {type}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BASIC SETTINGS  */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-medium text-lg text-gray-600 mb-4">
          Redeem Points Management
        </h2>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">
            1 Point → Rupee Conversion Rate
          </label>

          <input
            type="number"
            step="0.1"
            name="pointToRupeeRate"
            value={settings.pointToRupeeRate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-2 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <p className="text-xs text-gray-400 mt-1">
            1 Point = ₹{settings.pointToRupeeRate || 0}
          </p>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">
            Minimum Redeem Points
          </label>

          <input
            type="number"
            name="minRedeemPoints"
            value={settings.minRedeemPoints}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-2 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <p className="text-xs  text-gray-400 mt-1">
            Users must have at least {settings?.minRedeemPoints || 0} points to
            redeem.
          </p>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">
            Max Redeem Per Day
          </label>

          <input
            type="number"
            name="maxRedeemPerDay"
            value={settings.maxRedeemPerDay}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-2 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <p className="text-xs text-gray-400 mt-1">
            Maximum points a user can redeem per day.
          </p>
        </div>
      </div>

      {/*  EXPECTED COMPLETION SYSTEM */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 mb-6">
        <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center justify-between">
          <h2 className="font-medium text-lg text-gray-600">
            Expected Completion Time For Waste Report (By Waste Quantity)
          </h2>

          <button
            onClick={() => setShowRuleModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            + Add Rule
          </button>
        </div>

        <div className="space-y-3">
          {completionRules.map((rule, index) => (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-4 gap-3 border border-gray-200 rounded-xl p-3 bg-gray-50"
            >
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Min Kg
                </label>

                <input
                  type="number"
                  value={rule.minKg}
                  placeholder="Enter Minimum value in Kg"
                  onChange={(e) => handleMinKgChange(e.target.value, index)}
                  className="w-full border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none rounded-lg px-3 py-2 mt-1 placeholder:text-sm placeholder:text-gray-400"
                />

                <p className="text-xs text-gray-400 mt-1">
                  Minimum range in (Kg) for waste completion
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Max Kg
                </label>

                <input
                  type="number"
                  value={rule.maxKg}
                  placeholder="Enter Maximum value in Kg"
                  onChange={(e) => handleMaxKgChange(e.target.value, index)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none placeholder:text-sm placeholder:text-gray-400"
                />

                <p className="text-xs text-gray-400 mt-1">
                  Maximum range in (Kg) for waste completion
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Hours
                </label>

                <input
                  type="number"
                  value={rule.hours}
                  placeholder="Enter hours for waste collection"
                  onChange={(e) => handleHoursChange(e.target.value, index)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none placeholder:text-sm placeholder:text-gray-400"
                />

                <p className="text-xs text-gray-400 mt-1">
                  Hours for waste reoprt completion
                </p>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => deleteRule(index)}
                  className="w-full bg-red-100 hover:bg-red-200 text-red-400 hover:text-red-600 py-2 rounded-lg cursor-pointer"
                >
                  <i class="fa-solid fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*  SAVE BUTTON  */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full sm:w-auto sm:px-6 py-2 rounded-lg text-white text-sm  font-medium flex items-center justify-center gap-2 cursor-pointer
          ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {showRuleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add Completion Rule</h3>

            <div className="mb-3">
              <label className="text-sm text-gray-600">Min Kg</label>

              <input
                type="number"
                value={newRule.minKg}
                onChange={(e) =>
                  setNewRule({ ...newRule, minKg: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-600">Max Kg</label>

              <input
                type="number"
                value={newRule.maxKg}
                onChange={(e) =>
                  setNewRule({ ...newRule, maxKg: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-600">Hours</label>

              <input
                type="number"
                value={newRule.hours}
                onChange={(e) =>
                  setNewRule({ ...newRule, hours: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRuleModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={addRule}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {showWasteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add Waste Type</h3>

            <div className="mb-3">
              <label className="text-sm text-gray-600">Waste Type</label>

              <input
                type="text"
                value={newWaste.wasteType}
                onChange={(e) =>
                  setNewWaste({ ...newWaste, wasteType: e.target.value })
                }
                placeholder="Example: E-waste"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-600">Points</label>

              <input
                type="number"
                value={newWaste.points}
                onChange={(e) =>
                  setNewWaste({ ...newWaste, points: e.target.value })
                }
                placeholder="Enter reward points"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowWasteModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={addWasteType}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Waste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
