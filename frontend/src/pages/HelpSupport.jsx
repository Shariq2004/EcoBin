import React, { useState } from "react";
import { faqs, assets } from "../assets/assets";
import toast from "react-hot-toast";

const HelpSupport = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully!");
    setOpenModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F5FBF9] px-5 sm:px-8 lg:px-[10%] py-22">
      <div className="md:pt-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-medium md:font-semibold text-center text-gray-800 mb-3 md:mb-10">
          Help & Support
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div>
            <h2 className="text-lg text-center md:text-left md:text-2xl font-medium text-green-600 mb-3 md:mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3 md:space-y-4 ">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center justify-between p-3 md:p-4">
                    <h3 className="font:normal text-sm sm:text-lg md:font-medium text-gray-800">
                      {faq.question}
                    </h3>

                    <span
                      className={`transform transition-transform duration-500  ${
                        activeIndex === index ? "rotate-180" : ""
                      }`}
                    >
                      <img
                        className="w-2.5 md:w-3.5"
                        src={assets.dropdown_icon}
                        alt="dropdown"
                      />
                    </span>
                  </div>
 
                  <div
                    className={`px-3 md:px-5 transition-all duration-500 ease-in-out ${
                      activeIndex === index
                        ? "max-h-40 opacity-100 pb-4"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <p className="text-gray-600 text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-xl shadow p-3 md:p-6 h-fit">
            <h2 className="text-lg text-center md:text-left md:text-2xl font-medium text-green-600 mb-3 md:mb-6">
              Contact Support
            </h2>

            <p className="text-sm md:text-base text-center sm:text-left text-gray-600 mb-6">
              Still need help? Reach out to our support team.
            </p>

            <div className="space-y-5 text-gray-700">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center h-10 w-10 bg-green-100 rounded-full">
                  <i class="fa-solid fa-envelope text-green-600 text-lg"></i>
                </span>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm md:text-base">support@ecobin.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center h-10 w-10 bg-green-100 rounded-full">
                  <i class="fa-solid fa-phone text-green-600 text-lg"></i>
                </span>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm md:text-base">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center h-10 w-10 bg-green-100 rounded-full">
                  <i class="fa-solid fa-clock text-green-600 text-lg"></i>
                </span>
                <div>
                  <p className="font-medium">Support Hours</p>
                  <p className="text-sm md:text-base">
                    Mon – Sat: 9:00 AM – 6:00 PM
                    <br />
                    Sun & Public Holidays:{" "}
                    <span className="text-red-600">Closed</span>
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setOpenModal(true)}
              className="mt-6 w-full bg-green-500 text-white py-1 md:py-2 rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold"
            >
              Contact Now
            </button>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-[300px] md:w-full max-w-md p-6 rounded-lg shadow-lg relative animate-slideIn">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-sm md:text-xl font-bold cursor-pointer"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Contact Municipality
            </h2>
            <p className="text-gray-500 mb-6">
              Fill out the form below and we will get back to you as soon as
              possible.
            </p>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your message here..."
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-1.5 md:py-2 rounded-lg hover:bg-green-600 transition font-semibold cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSupport;
