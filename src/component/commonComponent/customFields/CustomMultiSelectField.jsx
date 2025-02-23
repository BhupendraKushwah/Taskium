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
            className={`text-primary border-0 rounded-md 
                    focus:outline-none focus:border-primary focus:shadow-[0_0_3px_#009966] 
                    hover:outline-none hover:border-primary hover:shadow-[0_0_3px_#009966] 
                    text-gray-500 font-normal
                    transition duration-300  ${className}`}
            options={options}
            {...props}
            styles={{
                control: (base) => ({
                  ...base,
                  zIndex: 9999,
                  padding: "2px",
                  border: "1.5px solid #c9ccd0",
                  color: textColor,
                  boxShadow: "none !important",
                  "*": {
                    boxShadow: "none !important",
                  },
                  "&:hover": {
                    border: "1.5px solid #009966 !important",
                  },
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 50,
                }),
                option: (base, { isSelected, isFocused }) => ({
                  ...base,
                  backgroundColor: isSelected ? " hsl(160, 100%, 40%)" : " #fff",
                  ":hover": {
                        backgroundColor: "hsl(160, 100%, 30%)",
                        color: "#fff",
                    },
              }),
              }}
              menuPortalTarget={document.body}
            onChange={onChange}
        />
        </>
    )
}

export default CustomMultiSelectField;