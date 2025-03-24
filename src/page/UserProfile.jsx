import React from 'react';
import { NavLink } from 'react-router';

const UserProfile = () => {
    return (
        <div className="min-h-screen p-4 sm:p-6">
            {/* Header */}
            <div className="mb-4 flex flex-col justify-between rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-700 sm:flex-row sm:items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h3>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
                {/* Profile Summary */}
                <div className="col-span-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-700 sm:col-span-2 md:col-span-5">
                    <div className="flex flex-col gap-4 sm:flex-row items-start md:justify-between">
                        {/* Profile Image and Info */}
                        <div className="flex sm:w-1/2 w-full items-center gap-4">
                            <div className="w-20 flex-shrink-0">
                                <img
                                    src="https://dummyimage.com/64x82/000/fff"
                                    alt="User"
                                    className="h-full w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="space-y-1">
                                <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Bhupendra Kushwah</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Software Developer, Agami Technologies
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Year: 2023 - Present</p>
                                <NavLink to="/settings" className="flex items-center gap-1 text-sm text-blue-500 cursor-pointer hover:underline">
                                    <i className="ph ph-fingerprint"></i> Reset Password
                                </NavLink>
                            </div>
                        </div>
                        {/* Contact Info */}
                        <div className="grid sm:w-1/2 w-full grid-cols-1 gap-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                            <div className="flex items-center gap-2 truncate">
                                <i className="ph ph-envelope-simple text-teal-600 dark:text-teal-400"></i>
                                bhupendrakushwah977@gmail.com
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="ph ph-phone text-teal-600 dark:text-teal-400"></i>
                                9770239467
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="ph ph-code text-teal-600 dark:text-teal-400"></i>
                                OX578SO
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information (Left) */}
                <div className="col-span-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-700 sm:col-span-1 md:col-span-2 md:row-span-2">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-600">
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h5>
                        <button className="rounded-full p-1 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <i className="ph ph-pencil-simple-line text-teal-600 dark:text-teal-400"></i>
                        </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className='min-w-[45%]'>
                            <p className="font-medium">Gender</p>
                            <span className='text-gray-400'>Male</span>
                        </div>
                        <div className='min-w-[45%]'>
                            <p className="font-medium">Date of Birth</p>
                            <span className='text-gray-400'>January 1, 1995</span>
                        </div>
                        <div className='min-w-[45%]'>
                            <p className="font-medium">Registered Email</p>
                            <span className='text-gray-400'>codie.bhupendra@gmail.com</span>
                        </div>
                        <div className='min-w-[45%]'>
                            <p className="font-medium">Permanent Address</p>
                            <span className='text-gray-400'>Kushwah Colony, Pinto Park, Morar, Gwalior</span>
                        </div>
                        <div className='min-w-[45%]'>
                            <p className="font-medium">Residential Address</p>
                            <span className='text-gray-400'>Kushwah Colony, Pinto Park, Morar, Gwalior</span>
                        </div>
                    </div>
                </div>

                {/* Additional Info (Right) */}
                <div className="col-span-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-700 sm:col-span-1 md:col-span-3 md:row-span-2">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-600">
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h5>
                        <button className="rounded-full p-1 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <i className="ph ph-pencil-simple-line text-teal-600 dark:text-teal-400"></i>
                        </button>
                    </div>
                    <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Placeholder for additional details.</p>
                    </div>
                </div>

                {/* Social Networks */}
                <div className="col-span-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-700 sm:col-span-2 md:col-span-5">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-600">
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Social Networks</h5>
                        <button className="rounded-full p-1 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <i className="ph ph-plus-circle text-teal-600 dark:text-teal-400"></i>
                        </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4">
                        {[
                            { src: '/images/social/facebook.png', label: 'Facebook' },
                            { src: '/images/social/linkedin.png', label: 'LinkedIn' },
                            { src: '/images/social/x.png', label: 'X' },
                            { src: '/images/social/instagram.png', label: 'Instagram' },
                        ].map((social, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <img src={social.src} alt={social.label} className="h-6 w-6 rounded-full object-cover" />
                                <p className="text-sm font-semibold text-teal-600 hover:underline cursor-pointer">
                                    Connect
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;