import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faCog,
  faDoorClosed,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { DOCTOR_INFO } from "../helpers/constants/StaticKeys";
import ACTION_TYPES from "../reducers/actionTypes";
import Logo from "../assets/Asset 10.png";

const Layout = ({ children, hideNavigation = false }) => {
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

  const handleLogout = () => {
    document.cookie.split("; ").forEach((cookie) => {
      const eqPos = cookie.indexOf(";");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
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
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <header className="w-full bg-primary shadow-md">
        <div className="w-full flex justify-center py-3">
          <div className="w-full max-w-full flex items-center justify-between px-16">
            {/* Logo on the left */}
            <div className="flex items-center">
              <img src={Logo} alt="Bimar Logo" className="h-12" />
            </div>

            {/* User menu and navigation on the right */}
            <div className="flex items-center space-x-6 text-white">
              {!hideNavigation && (
                <nav className="flex items-center space-x-6">
                  <Link
                    to="/"
                    className="flex items-center hover:text-tertiary transition duration-300"
                  >
                    <FontAwesomeIcon icon={faHome} className="mr-2" />
                    Home
                  </Link>
                  {/* <Link
                    to="/settings"
                    className="flex items-center text-gray-700 hover:text-tertiary transition duration-300"
                  >
                    <FontAwesomeIcon icon={faCog} className="mr-2" />
                    Settings
                  </Link> */}
                </nav>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 text-gray-700 hover:text-tertiary transition duration-300"
                  onClick={toggleDropdown}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>{userName}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
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
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 hover:bg-secondary hover:rounded-md transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
