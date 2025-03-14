import React from 'react'

const Button = ({
    children,
    handleClick,
    type='button',
    bgColor = 'bg-primary',
    textColor = 'text-white',
    className='',
    ...props }) => {
    return (
        <button className={`${bgColor} ${textColor}  rounded-md border-0 cursor-pointer px-2 py-1 ${className}`} onClick={handleClick} {...props}>
            {children}
        </button>
    )
}

export default Button;