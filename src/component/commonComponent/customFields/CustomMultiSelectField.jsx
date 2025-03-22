import React, { forwardRef, useState, useEffect } from 'react';
import ReactSelect from 'react-select';

const CustomMultiSelectField = forwardRef(
    ({ options = [], className = '', onChange, textColor = 'text-primary', ...props }, ref) => {
        const [isDarkMode, setIsDarkMode] = useState(
            document.documentElement.classList.contains('dark')
        );

        useEffect(() => {
            // Function to check dark mode
            const checkDarkMode = () => {
                setIsDarkMode(document.documentElement.classList.contains('dark'));
            };

            // Initial check
            checkDarkMode();

            // Use MutationObserver to watch for class changes on <html>
            const observer = new MutationObserver(checkDarkMode);
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class'],
            });

            // Cleanup observer on unmount
            return () => observer.disconnect();
        }, []);

        return (
            <ReactSelect
                ref={ref}
                className={`border-0 rounded-md 
                    focus:outline-none focus:border-teal-500 focus:shadow-[0_0_3px_#009966] 
                    hover:outline-none hover:border-teal-500 hover:shadow-[0_0_3px_#009966] 
                    text-gray-500 dark:text-white font-normal
                    transition duration-300 ${className}`}
                options={options}
                {...props}
                styles={{
                    control: (base) => ({
                        ...base,
                        padding: '2px',
                        border: isDarkMode ? '1.5px solid #4b5563' : '1.5px solid #c9ccd0', // gray-600 vs light gray
                        backgroundColor: isDarkMode ? '#374151' : '#ffffff', // gray-700 vs white
                        color: isDarkMode ? '#ffffff' : textColor, // white vs primary
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
                            : isDarkMode
                            ? '#374151' // gray-700
                            : '#fff',
                        color: isDarkMode ? '#ffffff' : '#000000', // white vs black
                        ':hover': {
                            backgroundColor: 'hsl(160, 100%, 30%)', // teal-600
                            color: '#fff',
                        },
                    }),
                    menu: (base) => ({
                        ...base,
                        backgroundColor: isDarkMode ? '#374151' : '#ffffff', // gray-700 vs white
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: isDarkMode ? '#ffffff' : '#374151', // white vs gray-700
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: isDarkMode ? '#9ca3af' : '#9ca3af', // gray-400 for both (adjustable)
                    }),
                }}
                onChange={onChange}
            />
        );
    }
);

export default CustomMultiSelectField;