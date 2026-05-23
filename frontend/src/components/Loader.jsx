import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center gap-3">
      <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-gray-600 text-lg font-medium">Loading...</span>
    </div>
  );
};

export default Loader;





