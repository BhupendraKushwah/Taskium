import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import Toggle from "./commonComponent/customFields/Toggle";
import { NavLink, useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext/ThemeContext";
import Notification from "./Notification";
import { useUser } from "../context/userContext/UserContext";
import { getImage } from "./commonComponent/common";
import toast from "react-hot-toast";

const Navbar = ({ handleSideNav, isSideNavOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate()
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('persistantState');
      sessionStorage.clear();
      navigate('/login')
      toast.success('Logged out successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred!';
      toast.error(errorMessage);
      console.error('Login error:', errorMessage);
    }
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('persistantState'));
    if (!userData?.token) navigate('/login');
  
    if (user) {
      setUserDetails(user);
    }
  
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [user]);
  
  return (
    <div className="w-full bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 dark:border-gray-700">
      <nav className="navbar flex justify-between items-center p-4 shadow-md rounded-lg">
        <div className="sidebar-button cursor-pointer" onClick={handleSideNav}>
          <i className={`fu ph-fill ph-text-${isSideNavOpen ? "outdent" : "indent"} text-4xl text-teal-500`}></i>
        </div>
        <div className="right-nav flex items-center gap-4">
          <div className="bell cursor-pointer" ref={notificationRef}>
            <span className="relative" onClick={toggleNotification}>
              <i className={`fu ph-fill ph-bell text-2xl text-gray-600 hover:text-teal-500 ${isNotificationOpen ? "text-teal-500" : ""} transition-colors duration-200`}></i>
            </span>
            {isNotificationOpen && <div className="absolute z-[9999] right-4">
              <Notification />
            </div>}
          </div>
          <div className="user-pic relative" ref={dropdownRef}>
            <button
              type="button"
              className="profile flex items-center text-sm border-2 border-teal-300 rounded-full focus:ring-4 focus:ring-teal-200 hover:border-teal-400 transition-all duration-200"
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
            >
              <span className="sr-only">Open user menu</span>
              <img
                src={userDetails.image ? getImage("profile/small", userDetails.image) : "https://dummyimage.com/64x82/000/fff"}
                alt="User"
                className="rounded-full w-10 h-10 cursor-pointer"
              />
            </button>
            <div
              className={`z-50 absolute right-0 mt-2 w-48 text-base list-none bg-gray-50 border border-gray-200 rounded-lg shadow-md transition-opacity duration-200 ${isDropdownOpen ? "block opacity-100" : "hidden opacity-0"
                } dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 dark:border-gray-700 dark:text-teal-400`}
            >
              <div className="px-4 py-3 bg-teal-50 rounded-t-lg border-b-1 border-gray-200 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 dark:border-gray-700 dark:text-teal-400">
                <NavLink to='profile/2' className="block text-sm font-semibold text-gray-900 dark:text-teal-400">{userDetails.name}</NavLink>
                <span className="block text-xs text-gray-500 truncate">{userDetails.email}</span>
              </div>
              <ul className="py-2">
                <li className="flex justify-between items-center block px-4 py-2 text-sm text-gray-700 dark:text-teal-400 hover:bg-teal-100 hover:text-teal-600 transition-colors duration-200">
                  <a
                    className=""
                  >
                    Dark mode
                  </a>
                  <div>
                    <Toggle size="sm" checked={theme === "dark"} onChange={toggleTheme} /></div>
                </li>
                <li>
                  <NavLink
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-teal-400 hover:bg-teal-100 hover:text-teal-600 transition-colors duration-200"
                  >
                    Settings
                  </NavLink>
                </li>
                <li>
                  <p onClick={signOut}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-teal-400 hover:bg-teal-100 hover:text-teal-600 transition-colors duration-200"
                  >
                    Sign out
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

Navbar.propTypes = {
  handleSideNav: PropTypes.func.isRequired,
};

export default Navbar;