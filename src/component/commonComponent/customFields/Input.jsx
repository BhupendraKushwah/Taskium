import React from 'react';

const Input = ({
    children,
    className = '',
    onChange,
    type = 'text',
    placeholder = 'Enter your text here',
    ...props
}, ref) => {
    return (
        <div>
            <input
                ref={ref}
                type={type}
                placeholder={placeholder}
                className={`p-2 border-gray-300 border rounded-md 
                    focus:outline-none focus:border-primary focus:shadow-[0_0_3px_#009966] 
                    hover:outline-none hover:border-primary hover:shadow-[0_0_3px_#009966] 
                    font-normal
                    transition duration-300 
                    !text-gray-500 dark:!text-white
                    ${className}`}
                {...props}
                onChange={onChange}
            />
        </div>
    );
};

export default React.forwardRef(Input);