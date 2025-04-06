import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { NavLink } from "react-router";
import AttendanceSheet from '../component/Dashboard/AttendanceSheet';
import PieChart from '../component/Dashboard/PieChart';
import { useUser } from '../context/userContext/UserContext';
ChartJS.register(ArcElement, Tooltip, Legend);

const ProjectDashboard = () => {
  const { user } = useUser();
  const dashboardData = {
    todayTasks: {
      title: "Today's Tasks",
      items: [
        { id: Date.now() + Math.random(), text: 'Design Review', status: 'done', priority: 'low' },
        { id: Date.now() + Math.random(), text: 'API Integration', status: 'in-progress', priority: 'medium' },
        { id: Date.now() + Math.random(), text: 'Team Sync', status: 'pending', priority: 'high' },
        { id: Date.now() + Math.random(), text: 'Bug Fixes', status: 'pending', priority: 'low' },
      ],
      progress: 50,
    },
    pendingTasks: {
      title: 'Pending Tasks',
      items: [
        { id: Date.now() + Math.random(), text: 'UI Prototype', status: 'pending', priority: 'high' },
        { id: Date.now() + Math.random(), text: 'Database Migration', status: 'in-progress', priority: 'medium' },
        { id: Date.now() + Math.random(), text: 'Testing Phase', status: 'pending', priority: 'low' },
        { id: Date.now() + Math.random(), text: 'Documentation', status: 'pending', priority: 'low' },
      ],
    },
    taskStats: {
      title: 'Task Statistics',
    },
    projects: {
      title: 'Projects',
      items: [
        { name: 'E-commerce Site', link: '#', status: 'done', date: '23 Feb 2020' },
        { name: 'Mobile App V2', link: '#', status: 'in-progress', date: '15 Mar 2021' },
        { name: 'CRM Dashboard', link: '#', status: 'pending', date: '10 Apr 2022' },
        { name: 'Blog Platform', link: '#', status: 'done', date: '05 Jan 2023' },
      ],
    },
  };

  const [dashboardContent, setDashboardContent] = useState(dashboardData);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    })
  );


  const greetMessage = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return 'Good Morning';
    else if (hours >= 12 && hours < 18) return 'Good Afternoon';
    else return 'Good Evening';
  };

  const handleStatusChange = (id, task) => {
    setDashboardContent((prevContent) => ({
      ...prevContent,
      [task]: {
        ...prevContent[task],
        items: prevContent[task].items.map((item) =>
          item.id === id ? { ...item, status: 'done' } : item
        ),
      },
    }));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gradient-to-br from-base-white-darker to-base-white-dark dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-900 min-h-screen w-full">
      <div className="container">
        {/* Header */}
        <div className="content-head flex flex-col sm:flex-row sm:items-center mb-3 mt-2 justify-between bg-white dark:bg-gray-800 p-2 rounded dark:border-gray-700">
          <h3 className="text-lg text-base-black dark:text-white truncate">
            {greetMessage()}, {user?.name}
          </h3>
          <div className="content-head-right flex items-center text-base-black-light dark:text-gray-300 text-sm space-x-2 sm:space-x-4">
            <span className="truncate">{new Date().toDateString()}</span>
            <span className="flex-shrink-0">{time}</span>
          </div>
        </div>

        {/* Updated Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto ">
          {/* Today Task */}
          <div className="rounded-xl cursor-pointer p-6 w-full shadow-xl hover:shadow-2xl hover:bg-hover-color transform hover:-translate-y-1 bg-white dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 min-h-[300px]">
            <h2 className="text-sm lg:text-lg font-semibold mb-4 text-base-black dark:text-white flex items-center">
              <span className="mr-2 bg-primary-light px-2 py-3 rounded"></span>
              {dashboardContent.todayTasks.title}
            </h2>
            <ul className="space-y-2 mb-4 text-sm text-text-sub dark:text-gray-300 overflow-y-auto max-h-[200px]">
              {dashboardContent.todayTasks.items.map((item, index) => (
                <li
                  key={`today-${index}`}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm transition-colors duration-200 ${item.status === 'done'
                      ? 'line-through bg-gray-300 dark:bg-gray-600 pointer-events-none opacity-50'
                      : 'hover:text-text-highlight dark:hover:text-gray-100'
                    }`}
                >
                  <span className="flex items-center min-w-0 flex-1">
                    <span className="relative inline-block custom-ui-checkbox">
                      <input
                        onClick={() => handleStatusChange(item.id, 'todayTasks')}
                        type="checkbox"
                        className={`w-4 h-4 mr-2 flex-shrink-0 rounded-md appearance-none border-2 cursor-pointer transition-all duration-200 ease-in-out ${item.status === 'done'
                            ? 'bg-primary-500 border-primary-700'
                            : item.status === 'in-progress'
                              ? 'bg-yellow-300 border-yellow-500'
                              : 'bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-600'
                          } hover:scale-110 hover:shadow-md checked:bg-opacity-90 checked:border-opacity-90`}
                        defaultChecked={item.status === 'done'}
                      />
                    </span>
                    <span className="truncate">{item.text}</span>
                  </span>
                  <span
                    className={`mt-2 sm:mt-0 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-full text-xs flex-shrink-0 sm:ml-2 ${item.priority === 'high'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200'
                        : item.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200'
                      }`}
                  >
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Task Stats */}
          <div className="rounded-xl cursor-pointer p-6 bg-white dark:bg-gray-800 dark:border-gray-700 w-full shadow-xl hover:shadow-2xl hover:bg-hover-color transform hover:-translate-y-1 transition-all duration-300 min-h-[300px] flex flex-col">
            <h2 className="text-sm lg:text-lg font-semibold mb-4 flex text-base-black dark:text-white items-center">
              <span className="mr-2 bg-primary-20 px-2 py-3 rounded"></span>
              {dashboardContent.taskStats.title}
            </h2>
            <div className="flex-grow relative">
              <PieChart dashboardContent={dashboardContent} />
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="rounded-xl cursor-pointer p-6 bg-white dark:bg-gray-800 dark:border-gray-700 w-full shadow-xl hover:shadow-2xl hover:bg-hover-color transform hover:-translate-y-1 transition-all duration-300 min-h-[300px]">
            <h2 className="text-sm lg:text-lg font-semibold mb-4 flex text-base-black dark:text-white items-center">
              <span className="mr-2 bg-blue-300 px-2 py-3 rounded"></span>
              {dashboardContent.pendingTasks.title}
            </h2>
            <ul className="space-y-2 text-sm text-text-sub dark:text-gray-300 overflow-y-auto max-h-[200px]">
              {dashboardContent.pendingTasks.items.map((item, index) => (
                <li
                  key={`pending-${index}`}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm transition-colors duration-200 ${item.status === 'done'
                      ? 'line-through bg-gray-300 dark:bg-gray-600 pointer-events-none opacity-50'
                      : 'hover:text-text-highlight dark:hover:text-gray-100'
                    }`}
                >
                  <span className="flex items-center min-w-0 flex-1">
                    <span className="relative inline-block custom-ui-checkbox">
                      <input
                        onClick={() => handleStatusChange(item.id, 'pendingTasks')}
                        type="checkbox"
                        className={`w-4 h-4 mr-2 flex-shrink-0 rounded-md appearance-none border-2 cursor-pointer transition-all duration-200 ease-in-out ${item.status === 'done'
                            ? 'bg-primary-500 border-primary-700'
                            : item.status === 'in-progress'
                              ? 'bg-yellow-300 border-yellow-500'
                              : 'bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-600'
                          } hover:scale-110 hover:shadow-md checked:bg-opacity-90 checked:border-opacity-90`}
                        defaultChecked={item.status === 'done'}
                      />
                    </span>
                    <span className="truncate">{item.text}</span>
                  </span>
                  <span
                    className={`mt-2 sm:mt-0 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-full text-xs flex-shrink-0 sm:ml-2 ${item.priority === 'high'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200'
                        : item.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200'
                      }`}
                  >
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects - Adjusted Width */}
          <div className="rounded-xl cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700 p-6 w-full shadow-xl hover:shadow-2xl hover:bg-hover-color transform hover:-translate-y-1 transition-all duration-300 min-h-[300px] md:col-span-2 lg:col-span-2">
            <h2 className="text-sm lg:text-lg font-semibold mb-4 flex text-base-black dark:text-white items-center">
              <span className="mr-2 bg-fuchsia-300 px-2 py-3 rounded"></span>
              {dashboardContent.projects.title}
            </h2>
            <div className="space-y-3 flex flex-wrap px-2 text-sm text-text-sub dark:text-gray-300 overflow-y-auto max-h-[300px]">
              {dashboardContent.projects.items.map((item, index) => (
                <div
                  key={`projects-${index}`}
                  className="flex justify-between flex-col relative text-xs sm:text-sm hover:text-text-highlight dark:hover:text-gray-100 transition-colors duration-200 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 w-full"
                >
                  <NavLink to={item.link} className="truncate font-medium">
                    {item.name}
                  </NavLink>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.date}</span>
                  <span
                    className={`mt-2 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-full text-xs flex-shrink-0 ${item.status === 'done meat'
                        ? 'bg-primary-20 text-primary border-primary dark:bg-primary-900 dark:text-primary-200 dark:border-primary-700'
                        : item.status === 'in-progress'
                          ? 'bg-yellow-200 text-yellow-800 border-yellow-400 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700'
                          : 'bg-white text-text-sub border-text-sub dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                      }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AttendanceSheet */}
          <AttendanceSheet />
        </div>
      </div>
    </section>
  );
};

export default ProjectDashboard;