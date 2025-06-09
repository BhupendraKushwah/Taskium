import React from 'react';
import PropTypes from 'prop-types';

const Toggle = ({ checked, onChange, disabled = false, size = 'md' }) => {
  const sizeStyles = {
    sm: {
      track: 'w-9 h-5',
      thumb: 'w-4 h-4',
      translate: 'peer-checked:translate-x-[18px]',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'peer-checked:translate-x-[22px]',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'peer-checked:translate-x-[30px]',
    },
    xl: {
      track: 'w-16 h-8',
      thumb: 'w-7 h-7',
      translate: 'peer-checked:translate-x-[34px]',
    },
  };

  const selectedSize = sizeStyles[size] || sizeStyles.md;

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        defaultChecked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      {/* Track */}
      <div
        className={`${selectedSize.track} rounded-full bg-gray-200 peer-checked:bg-teal-500 transition-colors duration-300 ease-in-out ${disabled ? 'opacity-50 cursor-not-allowed' : 'peer-focus:ring-2 peer-focus:ring-teal-300'
          }`}
      ></div>
      {/* Thumb */}
      <span
        className={`absolute left-[2px] top-1/2 -translate-y-1/2 ${selectedSize.thumb} bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out peer-checked:translate-x-full`}
        style={{
          transform: `translateY(0%)`,
        }}
      ></span>
    </label>
  );
};

Toggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
};

export default Toggle;
