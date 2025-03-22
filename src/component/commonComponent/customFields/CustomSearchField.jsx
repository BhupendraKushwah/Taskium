
const CustomSearchField = ({
    placeholder = '',
    onChange,
    onBlur,
    value,
    type,
    InputWidth = 'w-[300px]',
    className = '',
    disabled,
    ...props
}) => {
    return (
        <div className={` ${className} flex relative input-search`}>
            <i className="ph ph-magnifying-glass search-icon"></i>
            <input
                className={`ts-input-search ${InputWidth} fu-search-marg dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                type={type}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(event) => {
                    typeof onChange === 'function' && onChange(event.target.value)
                }}
                onBlur={(event) => {
                    typeof onBlur === 'function' && onBlur(event.target.value)
                }}
                {...props}
            />
            {value &&
                <button className='x-btn' type='button' >
                    <i id='reset' className='ph ph-x ' onClick={() => onChange('')}></i>
                </button>
            }
        </div>
    )
}

export default CustomSearchField
