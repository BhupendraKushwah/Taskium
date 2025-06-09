import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { NavLink } from 'react-router'; // Corrected import
import AttendanceSheet from '../component/Dashboard/AttendanceSheet';
import PieChart from '../component/Dashboard/PieChart';
import { useUser } from '../context/userContext/UserContext';
import useApi from '../hooks/instance';
import { useProject } from '../context/ProjectContext/ProjectContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProjectDashboard = () => {
  const { projects, getProjects, hasMore, setProject } = useProject();
  const { user } = useUser();
  const [pendingTasks, setPendingTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    })
  );

  // Memoized greeting message
  const greetMessage = useMemo(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return 'Good Morning';
    if (hours >= 12 && hours < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []); // No dependencies since it only relies on current time

  // Handle task status change
  const handleStatusChange = useCallback((id, taskType) => {
    const updateTasks = (tasks) =>
      tasks.map((item) =>
        item.id === id ? { ...item, status: 'Closed' } : item
      );

    if (taskType === 'todayTasks') {
      setTodayTasks(updateTasks);
    } else if (taskType === 'pendingTasks') {
      setPendingTasks(updateTasks);
    }
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      const { success, data } = await useApi().get('/tasks/dashboard-task');
      if (success) {
        setTodayTasks(data.todayTask || []);
        setPendingTasks(data.pendingTask || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard tasks:', error);
    }
    await getProjects();
  }, []);

  // Timer for updating time
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

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Memoized dashboard data
  const dashboardData = useMemo(
    () => ({
      todayTasks: {
        title: "Today's Tasks",
        items: todayTasks,
        progress: 50,
      },
      pendingTasks: {
        title: 'Pending Tasks',
        items: pendingTasks,
      },
      taskStats: {
        title: 'Task Statistics',
      },
      projects: {
        title: 'Projects',
        items: projects,
      },
    }),
    [todayTasks, pendingTasks, projects]
  );

  // Common task item renderer
  const renderTaskItem = (item, index, taskType) => (
    <li
      key={`${taskType}-${index}`}
      className={`flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm transition-colors duration-200 ${item.status === 'Closed'
          ? 'line-through bg-gray-300 dark:bg-gray-600 pointer-events-none opacity-50'
          : 'hover:text-text-highlight dark:hover:text-gray-100'
        }`}
    >
      <span className="flex items-center min-w-0 flex-1">
        <span className="relative inline-block custom-ui-checkbox">
          <input
            onChange={() => handleStatusChange(item.id, taskType)}
            type="checkbox"
            className={`w-4 h-4 mr-2 flex-shrink-0 rounded-md appearance-none border-2 cursor-pointer transition-all duration-200 ease-in-out ${item.status === 'Closed'
                ? 'bg-primary-500 border-primary-700'
                : item.status === 'in-progress'
                  ? 'bg-yellow-300 border-yellow-500'
                  : 'bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-600'
              } hover:scale-110 hover:shadow-md checked:bg-opacity-90 checked:border-opacity-90`}
            checked={item.status === 'Closed'}
          />
        </span>
        <span className="truncate">
          {item.subject.charAt(0).toUpperCase() + item.subject.slice(1)}
        </span>
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
  );

  return (
    <section className="bg-gradient-to-br from-base-white-darker to-base-white-dark dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-900 min-h-screen w-full">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-3 mt-2 justify-between bg-white dark:bg-gray-800 p-2 rounded dark:border-gray-700">
          <h3 className="text-lg text-base-black dark:text-white truncate">
            {greetMessage}, {user?.name}
          </h3>
          <div className="flex items-center text-base-black-light dark:text-gray-300 text-sm space-x-4">
            <span className="truncate">{new Date().toDateString()}</span>
            <span className="flex-shrink-0">{time}</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Today Task */}
          <div className="rounded-xl p-6 shadow-xl hover:shadow-2xl hover:bg-hover-color transform hover:-translate-y-1 bg-white dark:bg-gray-800 transition-all duration-300 min-h-[300px]">
            <h2 className="text-sm lg:text-lg font-semibold mb-4 text-base-black dark:text-white flex items-center">
              <span className="mr-2 bg-primary-light px-2 py-3 rounded" />
              {dashboardData.todayTasks.title}
            </h2>
            <ul className="space-y-2 mb-4 text-sm text-text-sub dark:text-gray-300 overflow-y-auto max-h-[200px]">
              {dashboardData.todayTasks.items.map((item, index) =>
                renderTaskItem(item, index, 'todayTasks')
              )}
            </ul>
          </div>

          {/* Task Stats */}
          <div className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl hover:bg-hover-color transform hover:-translate-y-1 transition-all duration-300 min-h-[300px] flex flex-col">
            <h2 className="text-sm lg:text-lg font-semibold mb-4 text-base-black dark:text-white flex items-center">
              <span className="mr-2 bg-primary-20 px-2 py-3 rounded" />
              {dashboardData.taskStats.title}
            </h2>
            <div className="flex-grow relative">
              <PieChart pendingTask={pendingTasks} todayTask={todayTasks} />
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl hover:bg-hover-color transform hover:-translate-y-1 transition-all duration-300 min-h-[300px]">
            <h2 className="text-sm lg:text-lg font-semibold mb-4 text-base-black dark:text-white flex items-center">
              <span className="mr-2 bg-blue-300 px-2 py-3 rounded" />
              {dashboardData.pendingTasks.title}
            </h2>
            <ul className="space-y-2 text-sm text-text-sub dark:text-gray-300 overflow-y-auto max-h-[200px]">
              {dashboardData.pendingTasks.items.map((item, index) =>
                renderTaskItem(item, index, 'pendingTasks')
              )}
            </ul>
          </div>

          {/* Projects */}
          <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl hover:shadow-2xl hover:bg-hover-color transform hover:-translate-y-1 transition-all duration-300 min-h-[300px] md:col-span-2 lg:col-span-2">
            <h2 className="text-sm lg:text-lg font-semibold mb-4 text-base-black dark:text-white flex items-center">
              <span className="mr-2 bg-fuchsia-300 px-2 py-3 rounded" />
              {dashboardData.projects.title}
            </h2>
            <div className="space-y-3 flex flex-wrap px-2 text-sm text-text-sub dark:text-gray-300 overflow-y-auto max-h-[300px]">
              {dashboardData.projects.items.map((item, index) => (
                <div
                  key={`projects-${index}`}
                  className="flex justify-between flex-col border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 w-full text-xs sm:text-sm hover:text-text-highlight dark:hover:text-gray-100 transition-colors duration-200"
                >
                  <NavLink to='/projects' className="truncate font-medium">
                    {item.projectName}
                  </NavLink>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.startDate).toLocaleDateString('en-CA')}
                  </span>
                  <span
                    className={`mt-2 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-full text-xs flex-shrink-0 ${item.status === 'Not Started'
                        ? 'bg-teal-600 text-teal-100 border-primary dark:bg-primary-900 dark:text-primary-200 dark:border-primary-700'
                        : item.status === 'In Progress'
                          ? 'bg-yellow-200 text-yellow-800 border-yellow-400 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700'
                          : item.status === 'Completed'
                            ? 'bg-green-200 text-green-800 border-green-400 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
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