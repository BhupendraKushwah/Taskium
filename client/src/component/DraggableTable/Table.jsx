import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Datepicker, CustomMultiSelectField, CustomSearchField } from '../commonComponent/customFields/index';
import { useImperativeHandle } from 'react';
import { forwardRef } from 'react';

// Column name mapping for API requests
const COLUMN_NAME_MAP = {
  Subject: 'subject',
  Assignee: 'assignee',
  'Created By': 'creator',
  Priority: 'priority',
  'Due Date': 'dueDate',
  Project: 'projectName',
  'Start Date': 'startDate',
  'Created At': 'createdAt',
};

const Table = forwardRef(({ customColumns = [], data, onEdit, onDelete, getData, onUpdate }, ref) => {

  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState({ column: null, order: 'desc' });
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [canFetchMore, setCanFetchMore] = useState(true);
  const [filterInputs, setFilterInputs] = useState({}); // Temporary state for input values

  const PAGE_SIZE = 15;
  const tableRef = useRef(null);
  const mobileRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const debounceTimeoutRef = useRef({}); // Store timeout IDs for each column

  // Prepare columns for rendering
  const columns = customColumns
    .filter((column) => column?.isActive)
    .map((column) => ({
      key: Object.keys(column)[0],
      label: column[Object.keys(column)[0]],
      field: column.field || 'text',
      isFilter: column.isFilter || false,
      isSort: column.isSort || false,
      options: column.option || [],
    }));

  const mobileColumns = columns.map((column) => ({
    label: column.label,
    value: column.key,
  }));

  // Define column widths based on content
  const getColumnWidthClass = (label) => {
    switch (label) {
      case 'ID':
        return 'min-w-[50px] w-1/6'; // Narrower for ID
      case 'Subject':
        return 'min-w-[200px] w-2/5'; // Wider for subject as it may have longer text
      case 'Assignee':
      case 'Created By':
      case 'Project':
        return 'min-w-[150px] w-1/5'; // Medium width for names and project
      case 'Priority':
        return 'min-w-[100px] w-1/6'; // Narrower for priority
      case 'Due Date':
      case 'Start Date':
      case 'Created At':
        return 'min-w-[120px] w-1/5'; // Medium width for dates
      default:
        return 'min-w-[150px] w-1/5'; // Default width
    }
  };

  // Fetch data with filters, sorting, and pagination
  const fetchData = useCallback(
    async (currentPage, reset = false) => {
      if (isFetching) return;
      const now = Date.now();
      if (now - lastFetchTimeRef.current < 500) return; // Throttle requests
      lastFetchTimeRef.current = now;

      setIsFetching(true);
      try {
        const filterParams = Object.entries(filters).reduce((acc, [key, { value }]) => {
          if (value) acc[COLUMN_NAME_MAP[key] || key] = value;
          return acc;
        }, {});

        const offset = (currentPage - 1) * PAGE_SIZE;

        const newData = await getData(filterParams, sortBy, offset);

        if (newData.length < PAGE_SIZE) {
          setCanFetchMore(false);
        } else {
          setCanFetchMore(true);
        }

        if (reset) {
          setPage(2); // Next page after reset
        } else {
          setPage(currentPage + 1);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCanFetchMore(false);
      } finally {
        setIsFetching(false);
      }
    },
    [filters, sortBy, getData, isFetching]
  );

  // Fetch data on filter or sort change
  useEffect(() => {
    setCanFetchMore(true);
    fetchData(1, true);
  }, [filters, sortBy, fetchData]);

  // Custom scroll listener for infinite scrolling
  const handleScroll = useCallback(
    (ref) => {
      if (!ref.current || isFetching || !canFetchMore) return;

      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 50; // Trigger 50px before bottom

      if (isBottom) {
        fetchData(page);
      }
    },
    [isFetching, canFetchMore, fetchData, page]
  );

 useImperativeHandle(ref, () => ({
    clearFilters() {
      setFilters({ search: '', category: '' });
    },
    getFilters() {
      return filters;
    }
  }));

  useEffect(() => {
    const tableElement = tableRef.current;
    const mobileElement = mobileRef.current;

    // Store previous scrollTop values to detect y-axis scrolling
    let prevTableScrollTop = tableElement ? tableElement.scrollTop : 0;
    let prevMobileScrollTop = mobileElement ? mobileElement.scrollTop : 0;

    const handleTableScroll = () => {
      if (tableElement && tableElement.scrollTop !== prevTableScrollTop) {
        prevTableScrollTop = tableElement.scrollTop; // Update previous scrollTop
        handleScroll(tableRef);
      }
    };

    const handleMobileScroll = () => {
      if (mobileElement && mobileElement.scrollTop !== prevMobileScrollTop) {
        prevMobileScrollTop = mobileElement.scrollTop; // Update previous scrollTop
        handleScroll(mobileRef);
      }
    };

    if (tableElement) {
      tableElement.addEventListener('scroll', handleTableScroll);
    }
    if (mobileElement) {
      mobileElement.addEventListener('scroll', handleMobileScroll);
    }

    return () => {
      if (tableElement) {
        tableElement.removeEventListener('scroll', handleTableScroll);
      }
      if (mobileElement) {
        mobileElement.removeEventListener('scroll', handleMobileScroll);
      }
    };
  }, [handleScroll]);

  // Handle sorting
  const handleSort = (columnLabel) => {
    const columnName = COLUMN_NAME_MAP[columnLabel] || columnLabel;
    setSortBy((prev) => ({
      column: columnName,
      order: prev.column === columnName && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Handle filter toggle (open/close filter dropdown or panel)
  const toggleFilter = (columnLabel, field) => {
    setFilters((prev) => ({
      ...prev,
      [columnLabel]: {
        ...prev[columnLabel],
        active: !prev[columnLabel]?.active,
        field,
        value: prev[columnLabel]?.value || '',
      },
    }));
  };

  // Apply filter
  const applyFilter = (columnLabel, field) => {
    const value = filterInputs[columnLabel] || '';
    setFilters((prev) => ({
      ...prev,
      [columnLabel]: {
        ...prev[columnLabel],
        active: prev[columnLabel]?.active ?? true, // Keep filter open
        value,
        field,
      },
    }));
  };

  // Debounced filter input change handler
  const handleFilterInputChange = (columnLabel, field, value) => {
    setFilterInputs((prev) => ({
      ...prev,
      [columnLabel]: value,
    }));

    // Clear any existing timeout for this column
    if (debounceTimeoutRef.current[columnLabel]) {
      clearTimeout(debounceTimeoutRef.current[columnLabel]);
    }

    // Set a new timeout for this column
    debounceTimeoutRef.current[columnLabel] = setTimeout(() => {
      applyFilter(columnLabel, field);
    }, 300);
  };

  // Clear filter
  const clearFilter = (columnLabel, field) => {
    setFilterInputs((prev) => ({
      ...prev,
      [columnLabel]: '',
    }));
    setFilters((prev) => ({
      ...prev,
      [columnLabel]: {
        ...prev[columnLabel],
        active: prev[columnLabel]?.active,
        value: '',
        field,
      },
    }));
  };

  // Safely render cell content
  const renderCellContent = (value) => {
    if (React.isValidElement(value)) return value;
    if (value == null) return '-';
    if (typeof value === 'string') return value.charAt(0).toUpperCase() + value.slice(1);
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return '-';
  };

  const handleUpdateStatus = async (id, task) => {
    try {
      setPage(1);
      onUpdate(id, task);
    }
    catch (error) {
      console.log(error);

    }
  }

  return (
    <div className="w-full h-full p-4 bg-gray-50 dark:bg-gray-800">
      {/* Mobile Filter Panel */}
      <div className="sm:hidden mb-4">
        <Button
          textColor="text-primary dark:text-teal-300"
          className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:border-gray-700"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <i className="ph ph-funnel text-lg"></i>
          <span className="text-sm text-gray-700 dark:text-gray-200">Filters</span>
        </Button>
        {isFilterOpen && (
          <div className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 dark:border-gray-700">
            {columns.map((column) => (
              <div key={column.key} className="mb-4">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase mb-1 block">
                  {column.label}
                </label>
                <div className="flex items-center gap-2">
                  {column.field === 'date' && (
                    <Datepicker
                      onDateChange={(date) => {
                        setFilters((prev) => ({
                          ...prev,
                          [column.label]: {
                            ...prev[column.label],
                            active: true,
                            value: date,
                            field: column.field,
                          },
                        }));
                      }}
                      className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                  )}
                  {column.field === 'select' && (
                    <CustomMultiSelectField
                      onChange={(e) => {
                        setFilters((prev) => ({
                          ...prev,
                          [column.label]: {
                            ...prev[column.label],
                            active: true,
                            value: e.value,
                            field: column.field,
                          },
                        }));
                      }}
                      options={column.options}
                      className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                  )}
                  {column.field === 'text' && (
                    <CustomSearchField
                      InputWidth="w-full"
                      value={filterInputs[column.label] || filters[column.label]?.value || ''}
                      onChange={(e) => handleFilterInputChange(column.label, column.field, e)}
                      placeholder={`Filter ${column.label}`}
                      className="text-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                  )}
                  {(filterInputs[column.label] || filters[column.label]?.value) && (
                    <Button
                      className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      onClick={() => clearFilter(column.label, column.field)}
                      aria-label="Clear filter"
                    >
                      <i className="ph ph-x text-sm"></i>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Table */}

      {data.length === 0 && !isFetching ? (
        <div
          className="hidden md:block px-4 py-3 text-center text-gray-500 dark:text-gray-400 text-sm"
        >
          No tasks found
        </div>
      ) :
        (<div className="hidden sm:block max-h-[calc(100vh-200px)] overflow-y-auto" ref={tableRef}>
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider ${getColumnWidthClass('ID')}`}
                >
                  #
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider ${getColumnWidthClass(column.label)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="truncate">{column.label}</span>
                        {column.isSort && (
                          <span
                            className="ml-1 text-gray-400 dark:text-gray-500 text-sm cursor-pointer"
                            onClick={() => handleSort(column.label)}
                          >
                            <i className="ph ph-arrows-down-up"></i>
                          </span>
                        )}
                      </div>
                      {column.isFilter && (
                        <Button
                          className="ml-2 p-2 text-gray-500 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          textColor="text-primary dark:text-teal-300"
                          bgColor="bg-white dark:bg-gray-800"
                          onClick={() => toggleFilter(column.label, column.field)}
                        >
                          <i className="ph ph-funnel text-base"></i>
                        </Button>
                      )}
                    </div>
                    {filters[column.label]?.active && (
                      <div className="mt-1 w-full max-w-[200px] px-2">
                        <div className="flex items-center gap-2 p-2 shadow-md rounded-md dark:border-gray-700">
                          {column.field === 'date' && (
                            <Datepicker
                              onDateChange={(date) => {
                                setFilters((prev) => ({
                                  ...prev,
                                  [column.label]: {
                                    ...prev[column.label],
                                    active: true,
                                    value: date,
                                    field: column.field,
                                  },
                                }));
                              }}
                              className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            />
                          )}
                          {column.field === 'select' && (
                            <CustomMultiSelectField
                              onChange={(e) => {
                                setFilters((prev) => ({
                                  ...prev,
                                  [column.label]: {
                                    ...prev[column.label],
                                    active: true,
                                    value: e.value,
                                    field: column.field,
                                  },
                                }));
                              }}
                              options={column.options}
                              className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            />
                          )}
                          {column.field === 'text' && (
                            <CustomSearchField
                              InputWidth="w-full"
                              value={filterInputs[column.label] || filters[column.label]?.value || ''}
                              onChange={(e) => handleFilterInputChange(column.label, column.field, e)}
                              placeholder={`Filter ${column.label}`}
                              className="text-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </th>
                ))}
                <th
                  className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider sticky right-0 z-10 bg-gray-50 dark:bg-gray-900"
                  style={{ width: '120px' }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                data.map((row, index) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-100"
                  >
                    <td className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm ${getColumnWidthClass('ID')}`}>
                      {index + 1}
                    </td>
                    {columns.map((column) => (
                      <td
                        key={`${row.id}-${column.key}`}
                        className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm ${getColumnWidthClass(column.label)}`}
                      >
                        <div className="flex gap-3 items-center">
                          {column.key === 'subject' ? (
                            <div className="flex gap-3 items-center">
                              <input
                                onClick={() => handleUpdateStatus(row.id, row)}
                                checked={row.status === 'Closed'}
                                type="checkbox"
                                className="peer relative appearance-none w-6 h-6 border-2 border-gray-300 rounded-full checked:bg-primary checked:border-primary after:content-['✔'] checked:after:text-white after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 focus:outline-none transition-all duration-300 ease-in-out cursor-pointer hover:border-primary"
                              />
                              <span className="truncate hover:text-primary dark:hover:text-teal-300 cursor-pointer" onClick={() => onEdit(row)} >{renderCellContent(row[COLUMN_NAME_MAP[column.label] || column.key])}</span>
                            </div>

                          ) :
                            <span className="truncate ">{renderCellContent(row[COLUMN_NAME_MAP[column.label] || column.key])}</span>
                          }
                        </div>
                      </td>
                    ))}
                    <td
                      className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm sticky right-0 z-1 bg-white dark:bg-gray-800 shadow-lg"
                      style={{ width: '120px' }}
                    >
                      <div className="flex gap-2">
                        <Button
                          className="p-2 text-blue-500 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                          onClick={() => onEdit(row)}
                        >
                          <i className="ph ph-eye text-base"></i>
                        </Button>
                        <Button
                          className="p-2 text-red-500 dark:text-red-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                          onClick={() => onDelete(row?.id)}
                        >
                          <i className="ph ph-trash text-base"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {isFetching && (
            <div className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              Loading...
            </div>
          )}
          {!canFetchMore && data.length > 0 && (
            <div className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              No more tasks to load
            </div>
          )}
        </div>)}

      {/* Mobile Card Layout */}
      <div className="sm:hidden max-h-[calc(100vh-200px)] overflow-y-auto" ref={mobileRef}>
        {data.length === 0 && !isFetching ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            No tasks found
          </div>
        ) : (
          data.map((row) => (
            <div
              key={row.id}
              className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
            >
              {mobileColumns.map((column) => (
                <div key={`${row.id}-${column.value}`} className="flex justify-between items-center py-1 gap-3">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">{column.label}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {renderCellContent(row[column.value])}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center py-1">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">Action</span>
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    className="p-2 text-blue-500 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    onClick={() => onEdit(row)}
                  >
                    <i className="ph ph-eye text-base"></i>
                  </Button>
                  <Button
                    className="p-2 text-red-500 dark:text-red-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    onClick={() => onDelete(row?.id)}
                  >
                    <i className="ph ph-trash text-base"></i>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
        {isFetching && (
          <div className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            Loading...
          </div>
        )}
        {!canFetchMore && data.length > 0 && (
          <div className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            No more tasks to load
          </div>
        )}
      </div>
    </div>
  );
});

export default Table;