import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";


const ImpactReport = () => {

  const { backendUrl, token, impact, fetchImpact} = useContext(AppContext);

  const stats = [
    {
      title: "Reports Submitted",
      value: impact.reportsSubmitted,
      icon: "fa-solid fa-location-dot",
    },
    {
      title: "Reports Resolved",
      value: impact.reportsResolved,
      icon: "fa-solid fa-check-circle",
    },
    {
      title: "Waste Types Reported",
      value: impact.wasteTypesReported,
      icon: "fa-solid fa-recycle",
    },
    {
      title: "Reward Points Earned",
      value: impact.rewardPointsEarned,
      icon: "fa-solid fa-coins",
    },
  ];

  useEffect(() => {
    if (token) {
      fetchImpact();
    }
  }, [token]);


  return (
    <div className="w-full mx-auto px-5 sm:px-8 lg:px-[9%] py-10 sm:py-14 md:py-18">

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium md:font-semibold text-gray-800 text-center mb-10 sm:mb-12">
        Your Eco Impact 
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">

        {stats.map((item, index) => (
         <div key={index} className="flex flex-col items-center bg-gray-50 p-5 sm:p-6 md:p-7 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 border border-green-100">
            <div className="flex items-center justify-center bg-green-100 w-14 h-14 sm:w-17 sm:h-17 rounded-full mb-3">
             <i className={`${item.icon} text-green-600 text-2xl sm:text-3xl`}></i>
            </div>
            <h3 className="text-[25px] sm:text-[35px] font-bold ">
             {item.value}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 sm:leading-relaxed">
             {item.title}
            </p>
          </div>

        ))}
      </div>

    </div>
  );
};

export default ImpactReport; 