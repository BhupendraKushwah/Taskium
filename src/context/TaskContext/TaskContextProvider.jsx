import { useState } from "react";
import TaskContext from "./TaskContext";

const TaskContextProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    const addTask = (task) => {
        setTasks(prev=>[...prev, task])
    }

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    const updateTask = (id, updatedTask) => {
        setTasks(tasks.map(task => (
            task.id === id ? updatedTask : task
        )))
    }
    const getTask = (id) => {
        return tasks.find(task => task.id === id)
    }

    return (
        <TaskContext.Provider value={{ tasks, addTask, deleteTask, updateTask, getTask }}>
            {children}
        </TaskContext.Provider>
    )
}

export default TaskContextProvider