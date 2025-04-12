import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router';
import useApi from '../hooks/instance';
import { getCustomTimeAgo, getImage } from './commonComponent/common';

const Notification = ({setNotificationCount}) => {
    const api = useApi();
    const [notificationData, setNotificationData] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const limit = 10;

    const getNotifications = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await api.get('/settings/notifications', {
                params: { limit, offset }
            });

            if (!response.success) {
                toast.error('Error while fetching notifications!');
                setIsLoading(false);
                return;
            }

            const newData = response.data || [];

            setNotificationData(prev => [...prev, ...newData]);
            setOffset(prev => prev + limit);

            if (newData.length < limit) {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred!';
            toast.error(errorMessage);
            console.error('Fetch error:', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await api.post('/settings/mark-all-as-read');
            if (!response.success) {
                toast.error('Error while marking notifications as read!');
                return;
            }
            setNotificationData(prev =>
                prev.map(n => ({ ...n, isRead: 1 }))
            );
            setNotificationCount(0)
            toast.success('All notifications marked as read');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred!';
            toast.error(errorMessage);
            console.error('Fetch error:', errorMessage);
        }
    };

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && hasMore) {
            getNotifications();
        }
    };

    useEffect(() => {
        getNotifications();
    }, [])

    return (
        <div className="w-[450px] h-[400px] overflow-hidden rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm dark:text-white">Notifications</h3>
                    <button className="flex items-center cursor-pointer text-teal-500 hover:text-teal-600 text-sm transition-colors" onClick={markAllAsRead}>
                        <i className="ph ph-checks mr-1"></i>
                        <span className='hover:underline decoration-teal-500 decoration-solid decoration-2'>Mark all as read</span>
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto max-h-[calc(400px-60px)]" onScroll={handleScroll}>
                {notificationData.length ? (
                    notificationData.map((notification, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                            <div className="flex-shrink-0 w-10 h-10">
                                {notification.image ? (
                                    <img
                                        src={getImage('profile/medium', notification.image)}
                                        alt={`${notification.username}'s avatar`}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-600 rounded-full font-medium text-lg border border-teal-200">
                                        {notification.usename.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 flex items-start">
                                {!notification.isRead && (
                                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 mt-1"></span>
                                )}
                                <div className="flex-1">
                                    <NavLink
                                        to={notification.url}
                                        className="text-sm text-gray-800 dark:text-gray-300 hover:text-teal-500 transition-colors block truncate"
                                    >
                                        {notification.message}
                                    </NavLink>
                                    <span className="text-xs text-gray-500 block mt-1">
                                        {getCustomTimeAgo(notification.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-[340px] text-gray-500">
                        <div className="text-center">
                            <i className="ph ph-bell text-2xl mb-2"></i>
                            <p className="text-sm">No notifications found</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;