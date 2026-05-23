import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

function Rewards() {
  const {
    userData,
    backendUrl,
    token,
    loadUserProfileData,
    loading,
    setLoading,
    transactions,
    setTransactions,
  } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [loadingRedeem, setLoadingRedeem] = useState(false);
  const [conversionRate, setConversionRate] = useState(0);
  const [minRedeemPoints, setMinRedeemPoints] = useState(0);
  const [maxRedeemPerDay, setMaxRedeemPerDay] = useState(0);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/settings/get");

      if (data.success && data.settings) {
        const points = data.settings.points;
        setConversionRate(points.pointToRupeeRate);
        setMinRedeemPoints(points.minRedeemPoints);
        setMaxRedeemPerDay(points.maxRedeemPerDay);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const redeemPoints = async () => {
    try {
      if (!redeemAmount || redeemAmount <= 0) {
        toast.error("Enter valid points");
        return;
      }

      const amount = Number(redeemAmount);

      if (amount < minRedeemPoints) {
        toast.error(`Minimum redeem is ${minRedeemPoints} points`);
        return;
      }

      if (amount > maxRedeemPerDay) {
        toast.error(`You can redeem maximum ${maxRedeemPerDay} points per day`);
        return;
      }

      if (amount > (userData?.rewardPoints || 0)) {
        toast.error("You don't have enough points to Redeem");
        return;
      }

      setLoadingRedeem(true);

      const { data } = await axios.post(
        backendUrl + "/api/user/redeem-points",
        { points: amount },
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);

        await loadUserProfileData();

        // setTransactions([]);
        await fetchTransactions();
        setShowModal(false);
        setRedeemAmount("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoadingRedeem(false);
    }
  };

  const fetchTransactions = async () => {
    // if (!transactions || transactions.length === 0) {
      try {
        setLoading(true);
        const { data } = await axios.get(
          backendUrl + "/api/user/getReward-Transaction",
          { headers: { token } },
        );

        if (data.success) {
          setTransactions(data.transactions);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    // }
  };

  const cancelRedeem = () => {
    setShowModal(false);
    setRedeemAmount("");
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token, backendUrl]);

  // useEffect(() => {
  //   fetchTransactions();
  // }, [transactions, backendUrl, token]);

  return (
    <div className="w-full px-5 sm:px-9 lg:px-[9%] pt-20 md:pt-24 pb-15 bg-[#F5FBF9]">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-medium md:font-semibold text-gray-800 mb-3 md:mb-6">
        Rewards
      </h1>

      {/* Top section Reward Balance  */}
      <div className="mb-4 md:mb-6">
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 border-l-4 border-green-500 ">
          <p className="text-lg md:text-xl font-medium mb-1 sm:mb-2 md:mb-4 text-gray-600">
            Reward Balance
          </p>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-green-500 text-2xl md:text-3xl lg:text-4xl">
              <i className="fa-solid fa-coins"></i>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-green-500">
                  {userData?.rewardPoints || 0}
                </p>

                <p className="md:text-xl font-medium text-green-500">
                  <i class="fa-solid fa-equals text-sm"></i>
                  <span className="ps-1">
                  <i class="fa-solid fa-indian-rupee-sign text-green-500 text-base sm:text-lg"></i>
                  {((userData?.rewardPoints || 0) * conversionRate).toFixed(2)}
                  </span>
                </p>
              </div>

              <p className="text-gray-500 text-sm md:text-base -mt-1">
                Available Points
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION (Redeem + Transactions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <div>
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 border border-gray-200 h-full flex flex-col ">
            <p className="text-lg sm:text-xl md:text-2xl font-medium md:font-semibold text-gray-800 mb-4 md:mb-5">
              Available Rewards
            </p>

            <div className="mt-4">
              <div>
                <div className="flex justify-between md:justify-start md:gap-8 items-center mb-3 text-base md:text-lg">
                  <p className="text-gray-700 font-semibold">Your Points</p>
                  <p className="text-green-500 font-bold">
                    {userData?.rewardPoints || 0} points
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-2 md:p-4 mb-4">
                  <p className="text-sm md:text-base text-green-600 font-medium">
                    Conversion Rate
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-gray-800 font-semibold">
                      1 Ecobin Points
                    </p>
                    <p className="text-green-500 font-bold">
                      = ₹ {conversionRate}
                    </p>
                  </div>

                  <div className="mt-1">
                    <p className="text-xs md:text-sm text-gray-600">
                      Minimum redeem:{" "}
                      <span className="text-green-500 font-semibold">
                        {minRedeemPoints}
                      </span>{" "}
                      points
                    </p>

                    <p className="text-xs md:text-sm text-gray-600">
                      Maximum redeem per day:{" "}
                      <span className="text-green-500 font-semibold">
                        {" "}
                        {maxRedeemPerDay}{" "}
                      </span>{" "}
                      points
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-base font-normal">
                  Redeem your earned points
                </p>

                <p className="text-gray-500 text-xs lg:text-sm mt-1">
                  Points earned from Completing waste report
                </p>

                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 bg-green-500 hover:bg-green-600 transition text-white w-full py-1.5 sm:py-2 rounded-xl cursor-pointer font-semibold"
                >
                  Redeem Points
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT → RECENT TRANSACTIONS */}
        <div className="bg-white rounded-2xl shadow-md py-4 md:py-6 border border-gray-200 px-4 md:px-6 max-h-[410px] flex flex-col">
          <p className="text-lg sm:text-xl md:text-2xl font-medium md:font-semibold text-gray-800 mb-8">
            Recent Transactions
          </p>

          <div className="flex flex-col gap-4 overflow-y-auto">
            {loading ? (
              <div className="py-20">
                <Loader />
              </div>
            ) : transactions.length > 0 ? (
              transactions.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-200 pb-2 text-sm md:text-base"
                >
                  <div className="flex items-center gap-4">
                    <i
                      className={`fa-solid ${
                        item.points > 0
                          ? "fa-arrow-up-right-from-square text-green-500"
                          : "fa-arrow-down text-red-500"
                      }`}
                    ></i>

                    <div>
                      <p className="font-medium text-gray-700">
                        {item.description}
                      </p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <p
                    className={
                      item.points > 0
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {item.points > 0 ? `+${item.points}` : item.points}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-20 text-base md:text-lg">
                No transactions found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* REDEEM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80">
            <h2 className="text-lg text-gray-700 font-semibold mb-4">
              Redeem Your Points
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              Available Points: {userData?.rewardPoints || 0}
            </p>

            <input
              type="number"
              placeholder="Enter points"
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(e.target.value)}
              className="w-full bg-gray-100 px-3 py-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition border border-gray-300"
            />

            <div className="flex  gap-2">
              <button
                onClick={cancelRedeem}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg cursor-pointer font-medium"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={redeemPoints}
                disabled={loadingRedeem || !redeemAmount}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  loadingRedeem || !redeemAmount
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                }`}
              >
                {loadingRedeem ? (
                  <span className="flex items-center justify-center">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>{" "}
                    Redeeming...
                  </span>
                ) : (
                  "Redeem"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rewards;
