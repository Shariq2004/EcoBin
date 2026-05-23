const HowItWorks = () => {
  
  return (
    <div  id="HowItWorks" className="w-full mx-auto px-5 sm:px-8 lg:px-[9%] py-12 sm:py-14 md:py-18 bg-[#F5FBF9] text-center ">
    
      <h2 className=" text-2xl sm:text-3xl md:text-4xl font-medium md:font-semibold text-gray-800 mb-8 sm:mb-10 md:mb-12">
        How It Works
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" >
      
        <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 relative">
          <span className="absolute -top-3 -left-3 bg-green-600 text-white w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full font-semibold text-sm sm:text-base">
            1
          </span>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center bg-green-100 w-14 h-14 sm:w-17 sm:h-17  rounded-full mb-4">
              <i className="fa-solid fa-camera text-green-600 text-2xl sm:text-3xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              Capture Waste
            </h3>
            <p className="text-sm sm:text-base text-gray-600 ">
              Upload a photo of the waste you want to dispose.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 relative">
          <span className="absolute -top-3 -left-3 bg-green-600 text-white w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full font-semibold text-sm sm:text-base">
            2
          </span>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center bg-green-100 w-14 h-14 sm:w-17 sm:h-17  rounded-full mb-4">
              <i className="fa-solid fa-robot text-green-600 text-2xl sm:text-3xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              AI Verification
            </h3>
            <p className="text-sm sm:text-base text-gray-600 ">
              AI analyzes the image and verifies the waste type instantly.
            </p>
          </div>
        </div>

        
        <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 relative">
          <span className="absolute -top-3 -left-3 bg-green-600 text-white w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full font-semibold text-sm sm:text-base">
            3
          </span>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center bg-green-100 w-14 h-14 sm:w-17 sm:h-17  rounded-full mb-4">
              <i className="fa-solid fa-user-check text-green-600 text-2xl sm:text-3xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              Worker Assigned
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              The available worker is automatically assigned.
            </p>
          </div>
        </div>

       
        <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 relative">
          <span className="absolute -top-3 -left-3 bg-green-600 text-white w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full font-semibold text-sm sm:text-base">
            4
          </span>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center bg-green-100 w-14 h-14 sm:w-17 sm:h-17  rounded-full mb-4">
              <i className="fa-solid fa-truck text-green-600 text-2xl sm:text-3xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">Pickup</h3>
            <p className="text-sm sm:text-base text-gray-600 ">
              Worker arrives and collects the waste safely.
            </p>
          </div>
        </div>

        
        <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 relative">
          <span className="absolute -top-3 -left-3 bg-green-600 text-white w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full font-semibold text-sm sm:text-base">
            5
          </span>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center bg-green-100 w-14 h-14 sm:w-17 sm:h-17  rounded-full mb-4">
              <i className="fa-solid fa-check-circle text-green-600 text-2xl sm:text-3xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">Completion</h3>
            <p className="text-sm sm:text-base text-gray-600 ">
              Waste is successfully disposed and status is updated.
            </p>
          </div>
        </div>

        
        <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 relative">
          <span className="absolute -top-3 -left-3 bg-green-600 text-white w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full font-semibold text-sm sm:text-base">
            6
          </span>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center bg-green-100 w-14 h-14 sm:w-17 sm:h-17  rounded-full mb-4">
              <i className="fa-solid fa-gift text-green-600 text-2xl sm:text-3xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              Rewards Earned
            </h3>
            <p className="text-sm sm:text-base text-gray-600 ">
              Earn ecobin points after each completed request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
