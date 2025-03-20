import React, { useEffect } from 'react'
import {Toggle} from '../commonComponent/customFields/index'

const CustomColumn = ({ columns, onClose, setCustomColumns }) => {
    const setColumns = (key) => {
        setCustomColumns(
            columns.map((column) =>
                Object.keys(column)[0] === key ?
                    { ...column, isActive: !column.isActive }
                    : column 
            ))
    }
    useEffect(()=>{
        localStorage.setItem('customColumns', JSON.stringify(columns));
    },[columns])
    return (
        <div className="w-full h-full fixed top-18 left-0 bg-[#0000004d] flex justify-end">
            <div className="w-3/4 sm:w-3/4 md:w-3/4 lg:w-1/2 h-[calc(100vh-72px)] bg-white shadow-lg p-5 overflow-y-auto">
                <div className="border-b border-gray-200 pb-2 flex justify-end">
                    <button onClick={onClose} className="cursor-pointer text-gray-600 hover:text-black">
                        <i className="ph ph-arrow-line-right text-xl"></i>
                    </button>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                    {columns.map((column, index) => {
                        let key = Object.keys(column).find(key => key !== 'field' && key !== 'isActive');
                        return (
                            <div className="border border-1 border-secondary rounded p-2 flex justify-between mb-2" key={index}><p className=''>
                                {column[key]}
                            </p>
                                <Toggle
                                    checked={column.isActive}
                                    onChange={() => setColumns(key)}
                                    disabled={false}
                                />
                            </div>)
                    })}
                </div>
            </div>
        </div>
    )
}

export default CustomColumn