import React, { useEffect, useState } from 'react';
import { Input, Button } from '../component/commonComponent/customFields';
import { Controller, useForm } from 'react-hook-form';
import useApi from '../hooks/instance';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const Setting = () => {
    const LoginData = [
        { id: 1, device: 'Windows', userAgent: 'windows', address: 'Raipur, Chhattisgarh, India', date: '23-01-2023', time: '10:30 AM' },
        { id: 2, device: 'Mac', userAgent: 'Macintosh', address: 'Raipur, Chhattisgarh, India', date: '23-01-2023', time: '10:30 AM' },
        { id: 3, device: 'Android', userAgent: 'android', address: 'Gwalior, Madhya Pradesh, India', date: '22-01-2023', time: '09:00 PM' },
    ];
    const api = useApi();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState({
        CurrentPassword: false,
        NewPassword: false,
        ConfirmPassword: false,
    });
    const [loginDevices, setLoginDevices] = useState({});
    const { control, handleSubmit, formState: { errors } } = useForm();

    const ChangePassword = (data) => {
        console.log(data);
    };

    function getDeviceIcon(osName = '') {
        osName = osName.toLowerCase();

        if (osName.includes('windows')) return <i className="text-2xl ph ph-desktop text-teal-500 dark:text-teal-300" />;
        if (osName.includes('mac')) return <i className="text-2xl ph ph-laptop text-teal-500 dark:text-teal-300" />;
        if (osName.includes('android')) return <i className="text-2xl ph ph-device-mobile text-teal-500 dark:text-teal-300" />;
        if (osName.includes('ios')) return <i className="text-2xl ph ph-device-tablet text-teal-500 dark:text-teal-300" />;
        if (osName.includes('linux')) return <i className="text-2xl ph ph-desktop text-teal-500 dark:text-teal-300" />;

        return <i className="text-2xl ph ph-question text-gray-500 dark:text-gray-400" />;
    }

    const handleLogout = async (device) => {
        try {
            let response = await api.post('/settings/logout', { token: device.sessionToken });
            if (response.success) {
                let savedToken = JSON.parse(localStorage.getItem('persistantState'))?.token;
                if (savedToken === device.sessionToken) {
                    localStorage.removeItem('persistantState');
                    navigate('/login')
                }
                else {
                    setLoginDevices(prev=>prev.filter((item) => item.sessionToken !== device.sessionToken));
                }
                toast.success(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        const getLoginDevices = async () => {
            try {
                let response = await api.get('/settings/login-devices');
                if (response.success) {
                    setLoginDevices(response.data);
                }
            } catch (error) {
                throw error;
            }
        }
        getLoginDevices();
    }, [loginDevices]);

    return (
        <div className="overflow-hidden dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
            <div className="content-head flex flex-col sm:flex-row sm:items-center mb-3 mt-2 justify-between bg-white dark:bg-gray-800 p-2 rounded dark:border-gray-700">
                <h3 className="text-lg text-base-black dark:text-white">Settings</h3>
                <div className="content-head-right flex items-center"></div>
            </div>
            <div className="container max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:border-gray-700">
                {/* Password Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-teal-600 dark:text-teal-400 mb-1">Change Password</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your password by entering your current credentials.</p>
                </div>
                <form onSubmit={handleSubmit(ChangePassword)} className="space-y-6">
                    {['CurrentPassword', 'NewPassword', 'ConfirmPassword'].map((field) => (
                        <div key={field} className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <label className="w-full sm:w-1/3 text-gray-700 dark:text-gray-300 font-medium">
                                    {field.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <div className="relative w-full sm:w-3/4 mb-2">
                                    <Controller
                                        control={control}
                                        name={field}
                                        rules={{ required: `${field.replace(/([A-Z])/g, ' $1').trim()} is required` }}
                                        render={({ field: { onChange, value } }) => (
                                            <Input
                                                className="w-full p-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-white dark:border-gray-600 rounded placeholder-gray-400 dark:placeholder-gray-500"
                                                type={showPassword[field] ? 'text' : 'password'}
                                                onChange={onChange}
                                                value={value}
                                            />
                                        )}
                                    />
                                    <span
                                        className="absolute top-3 right-4 text-teal-500 dark:text-teal-300 cursor-pointer"
                                        onClick={() => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))}
                                    >
                                        <i className={`text-xl ph ph-${showPassword[field] ? 'eye' : 'eye-closed'}`}></i>
                                    </span>
                                </div>
                            </div>
                            {errors[field] && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1 sm:ml-[33%] text-end">
                                    {errors[field].message}
                                </p>
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="px-6 py-2 text-white bg-gradient-to-r from-teal-400 to-teal-600 dark:from-teal-500 dark:to-teal-700 rounded-md shadow-md hover:from-teal-500 hover:to-teal-700 dark:hover:from-teal-600 dark:hover:to-teal-800 transition-all duration-300"
                        >
                            Update Password
                        </Button>
                    </div>
                </form>

                {/* Login Devices Section */}
                <div className="mt-12">
                    <h3 className="text-lg font-semibold text-teal-600 dark:text-teal-300 mb-1">Where You’re Logged In</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Monitor your active devices. We’ll notify you of unusual activity.</p>
                    <div className="space-y-4">
                        {loginDevices.length > 0 ? (
                            loginDevices.map((device) => (
                                <div
                                    key={device.id}
                                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <span className="p-3 bg-teal-100 dark:bg-teal-800 rounded-full">
                                        {getDeviceIcon(device.osName)}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {device.deviceType.charAt(0).toUpperCase() + device.deviceType.slice(1)} — {device.browserName} {device.browserVersion}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {device.osName} {device.osVersion}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {device.ipAddress} • {dayjs(device.createdAt).format('YYYY-MM-DD')} at {dayjs(device.createdAt).format('HH:mm A')}
                                        </p>
                                    </div>
                                    <button className="text-teal-500 dark:text-teal-300 hover:text-teal-700 dark:hover:text-teal-400 text-sm font-medium cursor-pointer" onClick={() => handleLogout(device)}>
                                        Log Out
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No devices logged in.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setting;