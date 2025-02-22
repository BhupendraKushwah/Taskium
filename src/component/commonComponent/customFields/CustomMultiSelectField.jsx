import ReactSelect from 'react-select'
const CustomMultiSelectField = ({
    options =[],
    className = '',
    onChange,
    textColor = 'text-primary',
    ...props
}) => {
    return (
        <>
        <ReactSelect
            className={`text-primary ${className}`}
            options={options}
            {...props}
            onChange={onChange}
        />
        </>
    )
}

export default CustomMultiSelectField;