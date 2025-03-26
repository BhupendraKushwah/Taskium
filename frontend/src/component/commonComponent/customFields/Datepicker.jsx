import React from "react";
import { DatePicker } from "antd";

function CustomDatepicker({ onDateChange, className = '', defaultValue = null ,...props },ref) {
  // Handle the date selection event
  const handleDateChange = (date, dateString) => {
    if (onDateChange) {
      onDateChange(dateString); // Call the parent callback
    }
  };

  return (
    <div className="flex items-center w-full">
      <DatePicker
      ref={ref}
        defaultValue={defaultValue}
        onChange={handleDateChange}
        className={`border-primary p-2 ${className}`}
        style={{
          borderRadius: "8px",
          padding: "0.5rem",
        }}
        {...props}
      />
    </div>
  );
}

export default React.forwardRef(CustomDatepicker);
