import React from "react";
import { DatePicker } from "antd";

function CustomDatepicker({ onDateChange, className='' }) {
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
        onChange={handleDateChange}
        className={`border-primary ${className}`}
        style={{
          borderRadius: "8px",
          padding: "5px 10px",
        }}
      />
    </div>
  );
}

export default CustomDatepicker;
