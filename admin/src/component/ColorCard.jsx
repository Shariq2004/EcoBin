import React from "react";

const ColorCard = ({ title, value, icon, gradient }) => {
  return (
    <div
      className={`relative rounded-xl p-8 text-white shadow-xl bg-gradient-to-br ${gradient}
      hover:scale-[1.03] transition duration-300 cursor-pointer`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

      <div className="flex justify-between items-center relative z-10">
        <div>
          <p className="text-base opacity-90">{title}</p>
          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>

        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default ColorCard;