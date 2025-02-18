import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faCog,
  faDoorClosed,
} from "@fortawesome/free-solid-svg-icons";
import { DOCTOR_INFO } from "../helpers/constants/StaticKeys";
import ACTION_TYPES from "../reducers/actionTypes";

const Layout = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const doctorData = localStorage.getItem(DOCTOR_INFO);
    if (doctorData && doctorData.trim().startsWith("{")) {
      try {
        const doctor = JSON.parse(doctorData);
        setUserName(doctor.doctorName);
      } catch (error) {
        console.error("Error parsing doctor data from local storage:", error);
      }
    }
  }, []); // Run only once on mount

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold tracking-wide hover:text-tertiary transition duration-300 cursor-pointer">
            <Link to="/">Bimar</Link>
          </h1>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="hover:text-tertiary transition duration-300"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Home
            </Link>
            <Link
              to="/settings"
              className="hover:text-tertiary transition duration-300"
            >
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              Settings
            </Link>
          </nav>

          {/* User Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none hover:text-tertiary transition duration-300 cursor-pointer"
              onClick={toggleDropdown}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>{userName}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md z-10 w-48">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-secondary hover:rounded-md transition"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    document.cookie.split("; ").forEach((cookie) => {
                      const eqPos = cookie.indexOf(";");
                      const name =
                        eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                      document.cookie =
                        name +
                        "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" +
                        window.location.hostname
                          .split(".")
                          .slice(-2)
                          .join(".")
                          .replace(/^\.+/, "");
                    });
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                  className="w-full text-left block px-4 py-2 hover:bg-secondary hover:rounded-md transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-6">{children}</main>
    </div>
  );
};

export default Layout;
