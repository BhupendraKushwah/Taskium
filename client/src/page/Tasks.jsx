import React, { useEffect, useState } from 'react';
import { Button } from '../component/commonComponent/customFields/';
import Table from '../component/DraggableTable/Table';
import { useTask } from '../context/TaskContext/TaskContext';
import TaskForm from '../component/Tasks/TaskForm';
import CustomColumn from '../component/DraggableTable/CustomColumn';
import { useProject } from '../context/ProjectContext/ProjectContext';
import { useUser } from '../context/userContext/UserContext';
import useApi from '../hooks/instance';
import dayjs from 'dayjs';
import { useRef } from 'react';

const Tasks = () => {
    const [taskForm, setTaskForm] = useState({
        open: false,
        task: null,
    });
    const { projects, getProjects } = useProject();
    const api = useApi();
    const { user } = useUser();
    const [customColumnsOpen, setCustomColumnsOpen] = useState(false);
    const { addTask, deleteTask, updateTask, getTasks, tasks, updateTaskStatus } = useTask();

    const filterRef = useRef();

    const handleClearFilters = () => {
        filterRef.current?.clearFilters();
    };

    const getUsersList = async () => {
        try {
            await getProjects();
            const response = await api.get('/settings/get-users');
            const data = response.data;
            setUsers(data);
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const [customColumns, setCustomColumns] = useState([]);
    const [users, setUsers] = useState(getUsersList);

    const handleSubmit = async (data) => {
        try {
            data['createdBy'] = user.id;
            data = { ...data, estimatedTime: dayjs(data.estimatedTime, 'HH:mm:ss') }
            if (data.id) {
                await updateTask(data.id, data);
            } else {
                await addTask(data);
            }
            setTaskForm({ open: false, task: null });
        } catch (error) {
            console.error(error);
        }
    };



    useEffect(() => {
        getTasks({}, {}, 0); // Fetch initial tasks with offset 0
    }, []);

    useEffect(() => {
        if (!tasks.length) return;

        // Define all possible task fields to ensure consistency
        const taskFields = [
            'subject',
            'assigneeTo', // Corrected typo from 'assigneTo'
            'createdBy',
            'projectId',
            'createdOn',
            'dueDate',
            'estimatedTime',
            'priority',
            'startDate',
            'type',
            'status',
            'createdAt',
        ];

        const generatedColumns = taskFields.map((key) => {
            switch (key) {
                case 'subject':
                    return { subject: 'Subject', field: 'text', isActive: true, isFilter: true, isSort: true };
                case 'assigneeTo': // Corrected typo
                    return {
                        assignee: 'Assignee',
                        field: 'select',
                        isActive: true,
                        option: users, // Use 'assigneeTo' for label
                        isFilter: true,
                        isSort: true,
                    };
                case 'createdBy':
                    return {
                        creator: 'Created By',
                        field: 'select',
                        isActive: true,
                        option: users, // Use 'createdBy' for label
                        isFilter: true,
                        isSort: true,
                    };
                case 'projectId':
                    return {
                        projectName: 'Project',
                        field: 'select',
                        isActive: true,
                        option: projects.map((item) => ({ label: item.projectName, value: item.id })),
                        isFilter: true,
                        isSort: true,
                    };
                case 'dueDate':
                    return { dueDate: 'Due Date', field: 'date', isActive: true, isFilter: true, isSort: true };
                case 'estimatedTime':
                    return { estimatedTime: 'Estimated Time', field: 'date', isActive: true, isFilter: false, isSort: false };
                case 'priority':
                    return {
                        priority: 'Priority',
                        field: 'select',
                        isActive: true,
                        option: ['High', 'Medium', 'Low'].map((item) => ({ label: item.toUpperCase(), value: item })),
                        isFilter: true,
                        isSort: true,
                    };
                case 'startDate':
                    return {
                        startDate: 'Start Date',
                        field: 'date',
                        isActive: true,
                        isFilter: true,
                        isSort: true,
                    };
                case 'type':
                    return {
                        type: 'Type',
                        field: 'select',
                        isActive: true,
                        option: ['Bug', 'Implementation', 'Feature'].map((item) => ({ label: item, value: item })),
                        isFilter: true,
                        isSort: true,
                    };
                case 'status':
                    return {
                        status: 'Status',
                        field: 'select',
                        isActive: true,
                        option: ['Open', 'In Progress', 'Closed'].map((item) => ({ label: item, value: item })),
                        isFilter: true,
                        isSort: true,
                    };
                case 'createdAt':
                    return { createdAt: 'Created At', field: 'date', isActive: true, isSort: true };
                default:
                    return null;
            }
        }).filter(Boolean);

        // Only set customColumns if it hasn't been initialized yet
        if (!customColumns.length) {
            setCustomColumns(generatedColumns);
        }
    }, [tasks, customColumns.length]);

    const handleDelete = (id) => {
        deleteTask(id);
    };

    const handleEdit = (task) => {
        setTaskForm({ open: true, task });
    };

    const handleUpdateStatus = async (id, task) => {
        try {
            await updateTaskStatus(id, task.status === 'Closed' ? 'Open' : 'Closed');
            setTaskForm({ open: false, task: null })
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div className="overflow-hidden dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
            <div className="content-head flex sm:flex-row sm:items-center mb-3 mt-2 justify-between bg-white dark:bg-gray-800 p-2 rounded dark:border-gray-700">
                <h3 className="text-lg text-gray-900 dark:text-white">Tasks</h3>
                <div className="content-head-right flex items-center">
                    {filterRef?.current?.getFilters() && Object.keys(filterRef?.current?.getFilters()).length ? <Button onClick={handleClearFilters}
                        bgColor="bg-primary-10 dark:bg-gray-800"
                        textColor="text-primary"
                        className="ml-2 bg-opacity-0 hover:bg-primary-20 dark:hover:bg-gray-700 border-primary dark:border-gray-600 border-1 transition-300 text-teal-600 dark:text-teal-300">
                        <i class="ph ph-x-circle"></i>
                    </Button>:''}
                    <Button
                        bgColor="bg-primary-10 dark:bg-gray-800"
                        textColor="text-primary"
                        className="ml-2 bg-opacity-0 hover:bg-primary-20 dark:hover:bg-gray-700 border-primary dark:border-gray-600 border-1 transition-300 text-teal-600 dark:text-teal-300"
                        handleClick={() => setCustomColumnsOpen(true)}
                    >
                        <i className="ph ph-faders-horizontal"></i>
                    </Button>
                    <Button
                        bgColor="bg-primary-10 dark:bg-gray-800"
                        textColor="text-primary"
                        className="ml-2 bg-opacity-0 hover:bg-primary-20 dark:hover:bg-gray-700 border-primary dark:border-gray-600 border-1 transition-300 text-teal-600 dark:text-teal-300"
                        handleClick={() => setTaskForm({ open: true, task: null })}
                    >
                        <i className="ph ph-plus"></i>
                    </Button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-2 rounded page overflow-x-auto dark:border-gray-700">
                <Table
                    customColumns={customColumns}
                    data={tasks}
                    getData={getTasks}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onUpdate={handleUpdateStatus}
                    ref={filterRef}
                />
            </div>
            {taskForm.open && (
                <TaskForm
                    task={taskForm.task}
                    onClose={() => setTaskForm({ open: false, task: null })}
                    onSubmit={handleSubmit}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
            {customColumnsOpen && (
                <CustomColumn
                    columns={customColumns}
                    setCustomColumns={setCustomColumns}
                    onClose={() => setCustomColumnsOpen(false)}
                />
            )}
        </div>
    );
};

export default Tasks;