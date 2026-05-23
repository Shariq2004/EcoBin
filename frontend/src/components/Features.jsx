const Features = () => {
  
  return (
   <div id="features" className="w-full mx-auto px-5 sm:px-8 lg:px-[9%] py-10 sm:py-14 md:py-18">
      
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium md:font-semibold text-gray-800 text-center mb-8 sm:mb-10 md:mb-12">
        Why EcoBin
      </h2>

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

        <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300">
          <i className="fa-solid fa-robot text-green-600 text-3xl sm:text-4xl mb-4"></i>
          <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
            AI Waste Verification
          </h3>
          <p className="text-sm sm:text-base text-gray-600 ">
            Upload images & AI instantly verifies waste type for quick
            approvals.
          </p>
        </div>

  
        <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300">
          <i className="fa-solid fa-user-check text-green-600 text-3xl sm:text-4xl mb-4"></i>
          <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
            Auto Worker Assignment
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            System assigns the available worker automatically.
          </p>
        </div>

        
        <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300">
          <i className="fa-solid fa-truck text-green-600 text-3xl sm:text-4xl mb-4"></i>
          <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
            Fast Worker Dispatch
          </h3>
          <p className="text-sm sm:text-base text-gray-600 ">
            Workers are notified instantly for quick waste pickup.
          </p>
        </div>

        
        <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300">
          <i className="fa-solid fa-bell text-green-600 text-3xl sm:text-4xl mb-4"></i>
          <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
            Smart Notifications
          </h3>
          <p className="text-sm sm:text-base text-gray-600 ">
            Alerts for request approval, completion, and earned rewards.
          </p>
        </div>

       
        <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300">
          <i className="fa-solid fa-chart-line text-green-600 text-3xl sm:text-4xl mb-4"></i>
          <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
            Impact Reports
          </h3>
          <p className="text-sm sm:text-base text-gray-600 ">
            View how many reports you submitted and How many ecobin pomits you earned.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300">
          <i className="fa-solid fa-eye text-green-600 text-3xl sm:text-4xl mb-4"></i>
          <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
            Real-time Monitoring
          </h3>
          <p className="text-sm sm:text-base text-gray-600 ">
            Track waste request progress and worker activity live.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
