import PropTypes from "prop-types";
import { NavLink } from "react-router"; // Fixed import typo

const SideNav = ({ isSideNavOpen }) => {
  return (
    <aside
      className={`h-[calc(100vh-64px)] group ${
        isSideNavOpen ? "w-64" : "w-16"
      } hover:w-64 transition-all duration-300 ease-in-out flex flex-col px-3 py-8 overflow-y-auto bg-gradient-to-b from-gray-50 to-teal-50 border-r border-teal-100 shadow-xl dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 dark:border-gray-700`}
    >
      <div className="flex flex-col justify-between flex-1">
        <nav
          className={`${
            isSideNavOpen ? "block" : "flex"
          } group-hover:block flex-col items-center space-y-6`}
        >
          {/* Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-gray-700 rounded-lg transition-all duration-300 group-hover:flex ${
                isActive
                  ? "bg-teal-100 text-teal-800 shadow-md"
                  : "hover:bg-teal-100 hover:text-teal-700"
              } dark:text-gray-300 dark:${
                isActive
                  ? "bg-teal-900 dark:text-teal-700"
                  : "dark:hover:bg-gray-700"
              }`
            }
          >
            <i className="ph ph-house w-6 h-full text-xl flex-shrink-0 text-teal-600 dark:text-teal-400"></i>
            <span
              className={`ml-3 font-semibold ${
                isSideNavOpen ? "block" : "hidden"
              } group-hover:block`}
            >
              Dashboard
            </span>
          </NavLink>

          {/* Projects */}
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-gray-700 rounded-lg transition-all duration-300 group-hover:flex ${
                isActive
                  ? "bg-teal-100 text-teal-800 shadow-md"
                  : "hover:bg-teal-100 hover:text-teal-700"
              } dark:text-gray-300 dark:${
                isActive
                  ? "bg-teal-900 dark:text-teal-700"
                  : "dark:hover:bg-gray-700"
              }`
            }
          >
            <i className="ph ph-folder-notch w-6 h-full text-xl flex-shrink-0 text-teal-600 dark:text-teal-400"></i>
            <span
              className={`ml-3 font-semibold ${
                isSideNavOpen ? "block" : "hidden"
              } group-hover:block`}
            >
              Projects
            </span>
          </NavLink>

          {/* Tasks */}
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-gray-700 rounded-lg transition-all duration-300 group-hover:flex ${
                isActive
                  ? "bg-teal-100 text-teal-800 shadow-md"
                  : "hover:bg-teal-100 hover:text-teal-700"
              } dark:text-gray-300 dark:${
                isActive
                  ? "bg-teal-900 dark:text-teal-700"
                  : "dark:hover:bg-gray-700"
              }`
            }
          >
            <i className="ph ph-check-square w-6 h-full text-xl flex-shrink-0 text-teal-600 dark:text-teal-400"></i>
            <span
              className={`ml-3 font-semibold ${
                isSideNavOpen ? "block" : "hidden"
              } group-hover:block`}
            >
              Tasks
            </span>
          </NavLink>

          {/* Settings */}
          <NavLink
            to="/settings" // Assuming this should be '/settings'?
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-gray-700 rounded-lg transition-all duration-300 group-hover:flex ${
                isActive
                  ? "bg-teal-100 text-teal-800 shadow-md"
                  : "hover:bg-teal-100 hover:text-teal-700"
              } dark:text-gray-300 dark:${
                isActive
                  ? "bg-teal-900 dark:text-teal-700"
                  : "dark:hover:bg-gray-700"
              }`
            }
          >
            <i className="ph ph-gear w-6 h-full text-xl flex-shrink-0 text-teal-600 dark:text-teal-400"></i>
            <span
              className={`ml-3 font-semibold ${
                isSideNavOpen ? "block" : "hidden"
              } group-hover:block`}
            >
              Settings
            </span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

SideNav.propTypes = {
  isSideNavOpen: PropTypes.bool.isRequired,
};

export default SideNav;