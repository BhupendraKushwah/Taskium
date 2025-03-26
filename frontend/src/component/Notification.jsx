import React from 'react';
import { NavLink } from 'react-router';

const Notification = () => {
    let notificationData = [
        {
            image: 'https://dummyimage.com/64x82/000/fff',
            message: 'Your task is pending!',
            time: '2 min ago',
            id: 1,
            usename: 'John Doe',
            link: '/profile/2'
        },
        {
            image: 'https://dummyimage.com/64x82/000/fff',
            message: 'Your task is pending!',
            time: '2 min ago',
            id: 1,
            usename: 'John Doe',
            link: '/profile/2'
        },
        {
            image: null,
            message: 'Your task is pending!',
            time: '2 min ago',
            id: 1,
            usename: 'John Doe',
            link: '/profile/2'
        },
        {
            image: 'https://dummyimage.com/64x82/000/fff',
            message: 'Your task is pending!',
            time: '2 min ago',
            id: 1,
            usename: 'John Doe',
            link: '/profile/2'
        }];

    return (
        <div className="w-[350px] h-[400px] overflow-hidden rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm dark:text-white">Notifications</h3>
                    <button className="flex items-center cursor-pointer text-teal-500 hover:text-teal-600 text-sm transition-colors">
                        <i className="ph ph-checks mr-1"></i>
                        <span className='hover:underline decoration-teal-500 decoration-solid decoration-2'>Mark all as read</span>
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto max-h-[calc(400px-60px)]">
                {notificationData.length > 0 ? (
                    notificationData.map((notification, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                            <div className="flex-shrink-0 w-10 h-10">
                                {notification.image ? (
                                    <img
                                        src={notification.image}
                                        alt={`${notification.username}'s avatar`}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-600 rounded-full font-medium text-lg border border-teal-200">
                                        {notification.usename.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <NavLink
                                    to={notification.link}
                                    className="text-sm text-gray-800 dark:text-gray-300 hover:text-teal-500 transition-colors block truncate"
                                >
                                    {notification.message}
                                </NavLink>
                                <span className="text-xs text-gray-500 block mt-1">
                                    {notification.time}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-[340px] text-gray-500">
                        <div className="text-center">
                            <i className="ph ph-bell text-2xl mb-2"></i>
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;