import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 text-gray-700">
      
      <div className="px-5 sm:px-10 lg:px-[10%]">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-10 md:mb-12 pt-8 ">
        
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-3">
              EcoBin
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Making waste management smarter, cleaner, and eco-friendly. Join
              us to recycle responsibly and make a real impact.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-5 text-lg">
              <a className="hover:text-green-600 transition" href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a className="hover:text-green-600 transition" href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a className="hover:text-green-600 transition" href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a className="hover:text-green-600 transition" href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <Link
                  to="/#features"
                  className="hover:text-green-600 transition"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/#HowItWorks"
                  className="hover:text-green-600 transition"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/#CallToAction"
                  className="hover:text-green-600 transition"
                >
                  Join EcoBin
                </Link>
              </li>
              <li>
                <Link
                  to={"/help-support"}
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-green-600 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Resources
            </h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <a href="#blog" className="hover:text-green-600 transition">
                  Blog
                </a>
              </li>
              <li>
                <Link
                  to={"/help-support"}
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-green-600 transition"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to={"/help-support"}
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-green-600 transition"
                >
                  Support
                </Link>
              </li>
              <li>
                <a href="#terms" className="hover:text-green-600 transition">
                  Terms & Privacy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600">
              <li>Najibabad, Uttar Pradesh, India</li>
              <li>+91 4565767878</li>
              <li>
                <a
                  href="mailto:Ecobin@email.com"
                  className="hover:text-green-600 transition"
                >
                  Ecobin@email.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className="
            border-t border-gray-200
            py-5
            text-sm
            flex flex-col sm:flex-row
            justify-between items-center
            gap-3
            text-gray-600
          "
        >
          <span className="text-center sm:text-left">
            <span className="text-xs"> <i className="fa-regular fa-copyright"></i></span> {new Date().getFullYear()} EcoBin. All rights reserved.
          </span>

          <div className="flex gap-4">
            <a href="#" className="hover:text-green-600 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-green-600 transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
