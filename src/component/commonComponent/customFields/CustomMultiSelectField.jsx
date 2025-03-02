import ReactSelect from 'react-select'
import React, { forwardRef } from 'react';

const CustomMultiSelectField = forwardRef(({ options = [], className = '', onChange, textColor = 'text-primary', ...props }, ref) => {
    return (
        <ReactSelect
            ref={ref} // 💪 This is the magic line
            className={`text-primary border-0 rounded-md 
                    focus:outline-none focus:border-primary focus:shadow-[0_0_3px_#009966] 
                    hover:outline-none hover:border-primary hover:shadow-[0_0_3px_#009966] 
                    text-gray-500 font-normal
                    transition duration-300 ${className}`}
            options={options}
            {...props}
            styles={{
                control: (base) => ({
                    ...base,
                    padding: "2px",
                    border: "1.5px solid #c9ccd0",
                    color: textColor,
                    boxShadow: "none",
                    "&:hover": { border: "1.5px solid #009966" },
                }),
                option: (base, { isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected ? "hsl(160, 100%, 40%)" : "#fff",
                    ":hover": {
                        backgroundColor: "hsl(160, 100%, 30%)",
                        color: "#fff",
                    },
                }),
            }}
            onChange={onChange}
        />
    );
});

export default CustomMultiSelectField;
