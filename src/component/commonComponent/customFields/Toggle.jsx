import React from 'react';

const Toggle = ({ checked, onChange, disabled = false }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div
        className={`w-12 h-6 rounded-full transition-all ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-300 peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary'} peer-checked:after:translate-x-6 after:content-[''] after:absolute after:w-5 after:h-5 after:bg-white after:rounded-full after:top-[2px] after:left-[2px] after:transition-all`}
      ></div>
    </label>
  );
};

export default Toggle;