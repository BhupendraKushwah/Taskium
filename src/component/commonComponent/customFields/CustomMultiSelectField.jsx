import React, { forwardRef, useState, useEffect } from 'react';
import ReactSelect from 'react-select';
import { useTheme } from '../../../context/ThemeContext/ThemeContext';

const CustomMultiSelectField = forwardRef(
    ({ options = [], className = '', onChange, textColor = 'text-primary', ...props }, ref) => {
        const { theme } = useTheme();
        console.log(theme)
        return (
            <ReactSelect
                ref={ref}
                className={`border-0 rounded-md 
                    focus:outline-none focus:border-teal-500 focus:shadow-[0_0_3px_#009966] 
                    hover:outline-none hover:border-teal-500 hover:shadow-[0_0_3px_#009966] 
                    text-gray-500 dark:text-white font-normal
                    transition duration-300 z-0 ${className}`}
                options={options}
                {...props}
                menuPortalTarget={document.body}
                styles={{
                    control: (base) => ({
                        ...base,
                        padding: '2px',
                        border: theme !== 'light' ? '1.5px solid #4b5563' : '1.5px solid #c9ccd0', // gray-600 vs light gray
                        backgroundColor: theme !== 'light' ? '#374151' : '#ffffff', // gray-700 vs white
                        color: theme !== 'light' ? '#ffffff' : textColor, // white vs primary
                        boxShadow: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                            border: '1.5px solid #009966', // teal-500 on hover
                        },
                    }),
                    option: (base, { isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected
                            ? 'hsl(160, 100%, 40%)' // teal-500
                            : theme !== 'light'
                                ? '#374151' // gray-700
                                : '#fff',
                        color: theme !== 'light' ? '#ffffff' : '#000000', // white vs black
                        ':hover': {
                            backgroundColor: 'hsl(160, 100%, 30%)', // teal-600
                            color: '#fff',
                        },
                    }),
                    menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                        backgroundColor: theme !== 'light' ? '#374151' : '#ffffff', // gray-700 vs white
                    }),
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999, // Ensure portal menu is on top
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: theme !== 'light' ? '#ffffff' : '#374151', // white vs gray-700
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: theme !== 'light' ? '#9ca3af' : '#9ca3af', // gray-400 for both (adjustable)
                    }),
                }}
                onChange={onChange}
            />
        );
    }
);

export default CustomMultiSelectField;