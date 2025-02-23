import React from "react";
import { DatePicker } from "antd";

function CustomDatepicker({ onDateChange, className = '', defaultValue = null ,...props }) {
  // Handle the date selection event
  const handleDateChange = (date, dateString) => {
    console.log("Selected Date:", dateString);
    if (onDateChange) {
      onDateChange(dateString); // Call the parent callback
    }
  };

  return (
    <div className="flex items-center w-full">
      <DatePicker
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

export default CustomDatepicker;
