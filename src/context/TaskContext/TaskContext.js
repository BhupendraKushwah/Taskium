import { useContext, createContext } from "react";

const TaskContext = createContext({
    tasks:[],
    addTask: (task) => {},
    deleteTask: (id) => {},
    updateTask: (id, task) => {},
    getTask: (id) => {},
});

export const useTask = () => useContext(TaskContext);

export default TaskContext;