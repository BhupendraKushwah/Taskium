import React from 'react'

const Input = ({
    children,
    className = '',
    ref = null,
    Onchange,
    type = 'text',
    placeholder='Enter your text here',
    ...props
}) => {
    return (
        <div>
            <input type={type} placeholder={placeholder} className={`px-2 py-1 border-gray-300 border rounded-md focus:border-0 focus:outline-primary focus:shadow-primary ${className}`} {...props} Onchange={Onchange} />
        </div>
    )
}

export default Input