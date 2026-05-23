import React, { useContext } from "react";
import { useNavigate  } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const CallToAction = () => {
  const navigate = useNavigate();
  

  const { token } = useContext(AppContext);

  const handleClick = () => {
    if (token) {
      navigate("/report-waste");
    } else {
      navigate("/login");
    }
    window.scrollTo(0, 0);
  };


  return (
    <div id="CallToAction" className="w-full mx-auto text-center px-5 sm:px-8 md:px-[8%] py-12 sm:py-14 md:py-16 bg-[#F5FBF9]" >
     
      <h2 className=" text-2xl sm:text-3xl md:text-4xl font-medium md:font-semibold text-gray-800 mb-4 sm:mb-5 md:mb-6 " >
        Join EcoBin Today
      </h2>

      <p className="text-gray-600 text-sm sm:text-base md:text-lg sm:leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-7 md:mb-8">
        Be a part of our eco-friendly mission. Start reporting, earn rewards,
        and make a difference in your community.
      </p>

      <button onClick={handleClick}
       className="
        bg-green-500 text-white
        text-base sm:text-lg
        px-6 sm:px-8
        py-2 md:py-3
        rounded-full
        font-medium md:font-semibold
        hover:bg-green-600
        hover:translate-x-2
        transition-all duration-300
        cursor-pointer
        inline-flex items-center gap-2
      "
      >
        Get Started
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default CallToAction;
