import React, { useState } from 'react';
import { Button, Input } from '../component/commonComponent/customFields';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import useApi from '../hooks/instance.js';
import toast from 'react-hot-toast';

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            username: '',
            password: '',
            rememberMe: false
        }
    });
    let api = useApi();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const onFormSubmit = async (data) => {
        try {
            const response = await api.post('/users/login', data);
    
            if (response.success) {
                localStorage.setItem('persistantState', JSON.stringify(response.data));
                toast.success(response.data.message || 'Login successful!');
                navigate('/');
            } else {
                console.log(response.data)
                toast.error(response.data?.message || 'Login failed!');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.details.error || 'An error occurred!';
            toast.error(errorMessage);
            console.error('Login error:', errorMessage);
        }
    };
    

    return (
        <div className="w-full min-h-screen flex flex-col sm:flex-row font-sans">
            {/* Left Section - Image */}
            <div className="sm:w-1/2 w-full sm:min-h-screen h-64 bg-gradient-to-r from-teal-800 to-teal-900 flex items-center justify-center transition-all duration-300">
                <img
                    src="/images/login.svg"
                    alt="Login illustration"
                    className="w-3/4 sm:w-1/2 max-w-md object-contain select-none pointer-events-none p-4 sm:p-0"
                    loading="lazy"
                />
            </div>

            {/* Right Section - Form */}
            <div className="sm:w-1/2 w-full flex-grow sm:min-h-screen bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-colors duration-300 py-6 sm:py-0">
                <div className="w-full max-w-md mx-4 sm:mx-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Please enter your credentials to login</p>
                    </div>

                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 sm:space-y-6">
                        <div className="space-y-1">
                            <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Username
                            </label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Username must be at least 3 characters'
                                    }
                                })}
                            />
                            {errors.username && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={`${showPassword ? 'text' : 'password'}`}
                                    placeholder="Enter your password"
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                />
                                <span
                                    className="absolute top-3 right-4 text-teal-500 dark:text-teal-300 cursor-pointer"
                                    onClick={() => setShowPassword(prev => (!prev))}
                                >
                                    <i className={`text-xl ph ph-${showPassword ? 'eye' : 'eye-closed'}`}></i>
                                </span>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer transition-all duration-200"
                                    {...register('rememberMe')}
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                            </label>
                            <NavLink
                                to="/forgot-password"
                                className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 transition-colors duration-200"
                            >
                                Forgot Password?
                            </NavLink>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2.5 px-4 rounded-full font-medium text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 dark:from-teal-500 dark:to-teal-600 dark:hover:from-teal-600 dark:hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <NavLink to="/signup" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 transition-colors duration-200">
                            Sign up
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;