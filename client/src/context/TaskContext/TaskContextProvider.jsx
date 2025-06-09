import { useState } from "react";
import TaskContext from "./TaskContext";
import useApi from "../../hooks/instance";
import toast from "react-hot-toast";

const TaskContextProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const api = useApi();
    const limit = 15; // Match the PAGE_SIZE in the Table component

    const saveSettings = async (response, callback) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (response.success) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                    resolve(response.message || 'Operation successful!');
                } else {
                    reject('Operation failed.');
                }
            }, 2000);
        });
    };

    const addTask = async (task) => {
        try {
            let response = await api.post('/tasks/addTask', task);
            toast.promise(
                saveSettings(response, async () => {
                    setTasks([]); // Reset tasks to trigger a fresh fetch
                    setOffset(0);
                    setHasMore(true);
                    await getTasks({}, {}, 0); // Fetch from the beginning
                }),
                {
                    loading: 'Saving...',
                    success: <b>{response.message || 'Task created!'}</b>,
                    error: <b>Could not create.</b>,
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTask = async (id) => {
        try {
            let response = await api.delete('/tasks/deleteTask', { id });
            toast.promise(
                saveSettings(response, () => {
                    setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
                }),
                {
                    loading: 'Deleting...',
                    success: <b>{response.message || 'Task deleted!'}</b>,
                    error: <b>Could not delete.</b>,
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    const updateTask = async (id, updatedTask) => {
        try {
            let response = await api.put('/tasks/updateTask', { id, data: updatedTask });
            toast.promise(
                saveSettings(response, async () => {
                    setTasks([]); // Reset tasks to trigger a fresh fetch
                    setOffset(0);
                    setHasMore(true);
                    await getTasks({}, {}, 0); // Fetch from the beginning
                }),
                {
                    loading: 'Saving...',
                    success: <b>{response.message || 'Task updated!'}</b>,
                    error: <b>Could not update.</b>,
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    const getTask = (id) => {
        return tasks.find(task => task.id === id);
    };

    const getTasks = async (filters = {}, sortBy = {}, off) => {
        try {
            const offsetToUse = off !== undefined ? off : offset;
            let response = await api.get('/tasks/', {
                filters,
                ...sortBy,
                limit,
                offset: offsetToUse
            });

            const newData = response.data.map(item => ({
                ...item,
                assignee: item.assigneToUser?.name,
                creator: item.createdByUser?.name,
                projectName: item.project?.projectName
            })) || [];

            if (response.success) {
                // If offset is 0 (e.g., due to filters or sorting change), reset tasks
                if (offsetToUse === 0) {
                    setTasks(newData);
                } else {
                    // Otherwise, append new data for infinite scrolling
                    setTasks(prev => [...prev, ...newData]);
                }

                setOffset(offsetToUse + limit);
                if (newData.length < limit) {
                    setHasMore(false);
                }

                return newData; // Return the new data for the Table component
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const updateTaskStatus = async (id, status) => {
        try {
            let response = await api.put('/tasks/updateTaskStatus', { id, status });
            toast.promise(
                saveSettings(response, async () => {
                    setTasks([]); // Reset tasks to trigger a fresh fetch
                    setOffset(0);
                    setHasMore(true);
                    await getTasks({}, {}, 0); // Fetch from the beginning
                }),
                {
                    loading: 'Saving...',
                    success: <b>{response.message || 'Status updated!'}</b>,
                    error: <b>Could not update status.</b>,
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, deleteTask, updateTask, getTask, getTasks, setOffset, updateTaskStatus, hasMore }}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskContextProvider;