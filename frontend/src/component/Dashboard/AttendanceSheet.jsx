import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/instance';

const AttendanceSheet = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const [attendance, setAttendance] = useState({});
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = today.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const api = useApi();

  useEffect(() => {
    const getAttendance = async () => {
      try {
        let response = await api.get('/settings/attendance');
        if (response.success) {
          setAttendance(response.userAttendance);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAttendance();
  }, []);

  useEffect(() => {
    console.log(attendance);
  }, [attendance]);


  const getStreak = () => {
    let streak = 0;
    const sortedDates = Object.keys(attendance).sort();

    for (let i = sortedDates.length - 1; i >= 0; i--) {
      if (attendance[sortedDates[i]] === 'PRESENT') streak++;
      else break;
    }
    return streak;
  };

  const renderCalendar = () => {
    const calendar = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendar.push(
        <div
          key={`empty-${i}`}
          className="p-1 sm:p-2 border border-gray-200 dark:border-gray-700 rounded flex justify-center items-center min-w-[1.5rem] h-6 sm:h-8 bg-gray-100 dark:bg-gray-800"
        >
          <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">-</span>
        </div>
      );
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = new Date(Date.UTC(year, month, day)).toLocaleDateString('en-CA').split('T')[0];
      const status = attendance[dateKey] || 'absent';
      calendar.push(
        <div
          key={dateKey}
          className={`p-1 sm:p-2 border border-gray-200 dark:border-gray-700 rounded flex justify-center items-center min-w-[1.5rem] h-6 sm:h-8 ${
            status === 'PRESENT'
              ? 'bg-green-200 dark:bg-green-700 dark:text-white'
              : status === 'partial'
                ? 'bg-yellow-200 dark:bg-yellow-700 dark:text-white'
                : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-300'
            } ${dateKey === today.toLocaleDateString('en-CA').split('T')[0] ? 'border-2 border-teal-500 dark:border-teal-400' : ''}`}
        >
          <span className="text-[10px] sm:text-xs">{day}</span>
        </div>
      );
    }
    return calendar;
  };

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 p-4 sm:p-6 w-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer transition-all duration-300 min-h-[300px] flex flex-col">
      <div className="mb-2 sm:mb-4 flex items-center">
        <h5 className="text-sm lg:text-lg font-semibold text-base-black dark:text-white flex items-center">
          <span className="mr-2 bg-teal-300 px-1 py-2 sm:px-2 sm:py-3 rounded"></span>
          {months[month]}-{year}
        </h5>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2 items-center content-center overflow-x-auto">
        {days.map((day, index) => (
          <div
            key={index}
            className="p-1 sm:p-2 border border-gray-200 dark:border-gray-700 rounded flex justify-center items-center min-w-[1.5rem] h-6 sm:h-8 bg-gray-50 dark:bg-gray-700"
          >
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 truncate">
              {day}
            </span>
          </div>
        ))}
        {renderCalendar()}
      </div>
      <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
        {/* Streak Badge */}
        <div className="flex items-center justify-center px-3 py-1 bg-gradient-to-r from-teal-300 to-teal-500 dark:from-teal-600 dark:to-teal-800 rounded-full shadow-md hover:scale-105 transition-transform duration-200">
          <span className="text-xs sm:text-sm text-white font-semibold flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            Streak: {getStreak()}
          </span>
        </div>

        {/* Attendance Badge */}
        <div className="flex items-center justify-center px-3 py-1 bg-gradient-to-r from-green-300 to-green-500 dark:from-green-600 dark:to-green-800 rounded-full shadow-md hover:scale-105 transition-transform duration-200">
          <span className="text-xs sm:text-sm text-white font-semibold flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {Object.values(attendance).filter((s) => s === 'PRESENT').length}/{daysInMonth}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSheet;