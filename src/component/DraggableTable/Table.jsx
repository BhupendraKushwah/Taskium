import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button, Datepicker, CustomMultiSelectField, CustomSearchField } from '../commonComponent/customFields/index'
import { useTask } from '../../context/TaskContext/TaskContext';

// Memoized Column Header Component with Resizing
const ColumnHeader = React.memo(({ setSortBy, column, filters, setFilters, width, onResize, field, option = [] }) => {
  const isFilterActive = filters[column]?.active || false;
  const searchValue = filters[column]?.value || '';
  const headerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.pageX;
    const startWidth = headerRef.current.offsetWidth;

    const handleMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.pageX - startX);
      onResize(column, Math.max(100, newWidth));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const setSortColumn = (column) => {
    setSortBy((prev) => {
      const isSameColumn = prev.column === column;
      const newSortType = isSameColumn 
        ? prev.sortType === 'asc' ? 'desc' : 'asc' 
        : 'desc';
      return {
        sortType: newSortType,
        column: column,
      };
    });
  };
  return (
    <th
      ref={headerRef}
      className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative"
      style={{ width: width, minWidth: '190px' }}
    >
      <div className="flex items-center justify-between">
        <div className="">
          <span className="truncate">{column}</span>
          <span className="ml-1 text-gray-400 text-sm cursor-pointer" onClick={() => setSortColumn(column)}>
            <i className="ph ph-arrows-down-up"></i>
          </span>
        </div>
        <Button
          className="ml-2 p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
          textColor="text-primary"
          bgColor="bg-white"
          aria-label={`Filter ${column}`}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              [column]: {
                active: !isFilterActive,
                value: searchValue,
                field,
              },
            }))
          }
        >
          <i className="ph ph-funnel text-base"></i>
        </Button>
      </div>
      {isFilterActive && (
        <div className="absolute left-0 top-full mt-1 z-10 w-full max-w-[200px] px-2">
          <div className="flex items-center gap-2 bg-white shadow-md rounded-md p-2">
            {field === 'date' && <Datepicker onDateChange={(date) => setFilters((prev) => ({ ...prev, [column]: { active: true, value: date, field } }))} className="w-full" />}
            {field === 'select' && <CustomMultiSelectField onChange={(e) => setFilters((prev) => ({ ...prev, [column]: { active: true, value: e.value, field } }))} options={option} className="w-full" />}
            {field === 'text' && <CustomSearchField InputWidth="w-full" value={searchValue} onChange={(e) => setFilters((prev) => ({ ...prev, [column]: { active: true, value: e, field }, }))} placeholder={`Filter ${column}`} className="text-sm" />}
          </div>
        </div>
      )}
      <div
        className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-gray-300 opacity-0 hover:opacity-100 transition-opacity"
        onMouseDown={handleMouseDown}
      />
    </th>
  );
});

// Memoized Row Cell Component
const RowCell = React.memo(({ content, width }) => (
  <td
    className="px-4 py-3 border-b border-gray-100 text-gray-600 text-sm"
    style={{ width: width, minWidth: '100px' }} // Simplified width as number (px assumed)
  >
    {content || '-'}
  </td>
));

// Mobile Card Component
const MobileCard = React.memo(({ row, columns }) => (
  <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
    {columns.map((column) => (
      <div key={`${row._id}-${column}`} className="flex justify-between items-center py-1">
        <span className="text-xs font-semibold text-gray-700 uppercase">{column}</span>
        <span className="text-sm text-gray-600">{row[column] || '-'}</span>
      </div>
    ))}
  </div>
));

const Table = ({ customColumns = [] }) => {
  const { tasks } = useTask();
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [columnWidths, setColumnWidths] = useState({});
  const [filteredRows, setFilteredRows] = useState([])
  const [sortBy, setSortBy] = useState({
    column: null,
    sortType: 'asc'
  })

  // Memoize columns
  const columns = useMemo(() => {
    return customColumns.filter((column) => column.isActive).map((column) => Object.keys(column)[0]);
  }, [tasks, customColumns]);
  console.log(customColumns);
  const savedWidth = useMemo(() => localStorage.getItem('columnWidths'), [])

  useEffect(() => {
    if (!columns.length && !Object.keys(columnWidths).length) return;
    let initialWidths = {};
    columns.forEach((column) => {
      initialWidths[column] = 190;
    });
    setColumnWidths(savedWidth ? JSON.parse(savedWidth) : initialWidths);
    setFilteredRows(filtertableRow)
  }, [columns,filters]);

  // Handle column resize
  const handleResize = (column, newWidth) => {
    let col = customColumns.find((col) => Object.values(col)[0] === column)
    let [targetCol] = Object.keys(col)
    setColumnWidths((prev) => ({
      ...prev,
      [targetCol]: newWidth,
    }));
    localStorage.setItem('columnWidths', JSON.stringify({ ...columnWidths, [targetCol]: newWidth }));
  };

  const sortByFunc = ({ column, sortType }) => {
    let col2 = Object.keys(customColumns.find((col) => Object.values(col)[0] === column))[0];

    let sortedRows = [...filteredRows]; // Shallow copy to avoid mutating original state

    sortedRows.sort((a, b) => {
      const valA = a[col2]?.toString()?.toLowerCase() || '';
      const valB = b[col2]?.toString()?.toLowerCase() || '';

      if (sortType === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });
    setFilteredRows(sortedRows)
  }

  useEffect(() => {
    sortBy.column &&
      sortByFunc(sortBy)
  }, [sortBy])

  // Filter the rows based on all active filters
  const filtertableRow = () => {
    return tasks.filter((row) => {
      return Object.entries(filters).every(([column, filter]) => {
        if (!filter.active || !filter.value) return true;

        let col = customColumns.find((col) => Object.values(col)[0] === column)
        let [targetCol] = Object.keys(col)

        switch (filter.field) {
          case 'date':
            return new Date(row[targetCol]) >= new Date(filter.value);
          case 'select':
            return row[targetCol].includes(filter.value);
          case 'text':
            return row[targetCol]
              ?.toString()
              .toLowerCase()
              .includes(filter.value.toLowerCase());
        }
      });
    });
  }

  return (
    <div className="w-full h-full p-4 bg-gray-50">
      {/* Filter Toggle Button and Panel (Mobile Only) */}
      <div className="sm:hidden mb-4">
        <Button
          textColor="text-primary"
          className="w-full p-3 bg-white rounded-lg shadow-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <i className="ph ph-funnel text-lg"></i>
          <span className="text-sm">Filters</span>
        </Button>
        {isFilterOpen && (
          <div className="mt-2 p-4 bg-white rounded-lg shadow-md transition-all duration-300">
            {columns.map((column) => {
              const searchValue = filters[column]?.value || '';
              return (
                <div key={column} className="mb-4">
                  <label className="text-xs font-semibold text-gray-700 uppercase mb-1 block">
                    {column}
                  </label>
                  <div className="flex items-center gap-2">
                    <CustomSearchField
                      InputWidth="w-full"
                      value={searchValue}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [column]: {
                            active: true,
                            value: e,
                            field
                          },
                        }))
                      }
                      placeholder={`Filter ${column}`}
                      className="text-sm"
                    />
                    {searchValue && (
                      <Button
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            [column]: {
                              active: true,
                              value: '',
                            },
                          }))
                        }
                        aria-label="Clear filter"
                      >
                        <i className="ph ph-x text-sm"></i>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block h-full overflow-x-auto">
        <table className="w-full border-collapse text-sm font-sans table-fixed">
          <thead>
            <tr className="select-none">
              {columns.map((column) => (
                <ColumnHeader
                  setSortBy={setSortBy}
                  key={column}
                  column={customColumns.find((col) => Object.keys(col)[0] === column)[column]}
                  field={customColumns.find((col) => Object.keys(col)[0] === column)['field']}
                  option={customColumns.find((col) => Object.keys(col)[0] === column)['option'] || []}
                  filters={filters}
                  setFilters={setFilters}
                  width={columnWidths[column] || 150}
                  onResize={handleResize}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-3 text-center text-gray-500 text-sm">
                  No results found
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr
                  key={row._id}
                  className="hover:bg-gray-50 transition-colors duration-100"
                >
                  {columns.map((column) => (
                    <RowCell
                      key={`${row._id}-${column}`}
                      content={row[column]}
                      width={columnWidths[column] || 150}
                    />
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="sm:hidden">
        {filteredRows.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">No results found</div>
        ) : (
          filteredRows.map((row) => (
            <MobileCard key={row._id} row={row} columns={columns} />
          ))
        )}
      </div>
    </div>
  );
};

export default Table;