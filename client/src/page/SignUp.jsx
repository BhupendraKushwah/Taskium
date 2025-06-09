import React, { useState } from 'react';
import { Button, Input } from '../component/commonComponent/customFields';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from "react-router";
import useApi  from "../hooks/instance";
import toast from 'react-hot-toast';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      phone: '',
      rememberMe: false
    }
  });
  const api = useApi();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const onFormSubmit = async (data) => {
    try {
      const response = await api.post('/users/signup',data);
      if(response.success){
        toast.success(response.message);
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.details.error);
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col sm:flex-row font-sans">
      {/* Left Section - Image */}
      <div className="sm:w-1/2 w-full sm:min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-800 to-teal-900 transition-all duration-300">
        <img
          src="/images/sign.svg"
          alt="Signup illustration"
          className="w-3/4 sm:w-2/3 max-w-md object-contain select-none pointer-events-none p-4 sm:p-0"
          loading="lazy"
        />
      </div>

      {/* Right Section - Form */}
      <div className="sm:w-1/2 w-full sm:min-h-screen bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-colors duration-300 py-6 sm:py-3">
        <div className="w-full max-w-md mx-4 sm:mx-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Create Your Account</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Join us today</p>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 sm:space-y-6">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-200  rounded-md focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
              />
              {errors.name && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-200  rounded-md focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="w-full px-3 py-2 border border-gray-200  rounded-md focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                {...register('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Username must be at least 3 characters' },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Username can only contain letters, numbers, and underscores'
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-200  rounded-md focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
                      message: 'Password must contain at least one letter and one number'
                    }
                  })}
                />
                <span
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-teal-500 dark:text-teal-300 cursor-pointer"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  <i className={`text-xl ph ph-${showPassword ? 'eye' : 'eye-closed'}`}></i>
                </span>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 border border-gray-200  rounded-md focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: 'Please enter a valid phone number'
                  }
                })}
              />
              {errors.phone && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.phone.message}</p>
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
              className={`w-full py-2.5 px-4 rounded-full font-medium text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 dark:from-teal-500 dark:to-teal-600 dark:hover:from-teal-600 dark:hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <NavLink to="/login" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 transition-colors duration-200">
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;