import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Hero = () => {
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
    <div
      className="w-full min-h-screen flex flex-col md:flex-row items-center justify-between px-5 sm:px-8 lg:px-[9%] pt-22 md:pt-28 pb-10 sm:pb-16 gap-5 md:gap-10 bg-[#F5FBF9]"
    >
      {/*---- Left Side (Content) ----*/}
      <div className="w-full md:w-1/2 flex flex-col gap-3 sm:gap-6 md:gap-8  text-left">
        <h1
          className="
         text-2xl sm:text-3xl md:text-4xl lg:text-[45px]
         font-semibold
         leading-[1.3] md:leading-[1.1]  
         text-gray-800
         tracking-wide
        "
        >
          EcoBin Smart Waste Management Platform
        </h1>

        <p
          className="
          text-base md:text-lg lg:text-xl
          text-[#4A5A67]
          leading-relaxed
        "
        >
          Designed to reduce overflow, enhance operational efficiency, and build
          cleaner, greener communities through the power of smart technology.
          EcoBin transforms manual waste handling into an intelligent,
          automated, and eco-friendly system.
        </p>

        <button
          onClick={handleClick}
          className="
          bg-green-500 text-white
          text-base sm:text-lg
          px-5 sm:px-8 py-2 md:py-3
          rounded-full
          font-semibold
          w-fit mx-0 mt-2
          hover:bg-green-600
          hover:-translate-y-1
          transition-all duration-300
          shadow-md hover:shadow-lg
          cursor-pointer
        "
        >
          Try EcoBin Now
          <i className="fa-solid fa-arrow-right ml-2"></i>
        </button>
      </div>

      {/*---- Right Side (Image) ----*/}
      <div className="w-[120%] sm:w-[90%] md:w-[60%] lg:w-[50%] object-contain drop-shadow-lg flex justify-center items-center">
        <img
          src={assets.home_banner}
          alt="EcoBin Banner"
          className="
          w-[85%] sm:w-[80%] md:w-[90%] lg:w-[80%]
          object-contain
          drop-shadow-lg
        "
        />
      </div>
    </div>
  );
};

export default Hero;
