import React, { useEffect, useState } from 'react'
import { Button } from '../component/commonComponent/customFields/'
import Table from '../component/DraggableTable/Table';
import { useTask } from '../context/TaskContext/TaskContext';
import TaskForm from '../component/Tasks/TaskForm';
import CustomColumn from '../component/DraggableTable/CustomColumn';
import { useProject } from '../context/ProjectContext/ProjectContext';


const Tasks = () => {
    const [taskForm, setTaskForm] = useState({
        open: false,
        id: null
    });
    const { projects } = useProject();
    const [customColumnsOpen, setCustomColumnsOpen] = useState(false);
    const { addTask, deleteTask, updateTask, getTask } = useTask();
    const initialData = [
        {
            "_id": "67c1ac2e06a9aedcf9fd02f9",
            "subject": "In access right module> school admin side",
            "assignTo": "Sagar Nalwa",
            "createdBy": "Pooja Bisht",
            "createdOn": "2025-02-28T12:29:34.664Z",
            "dueDate": "2025-02-28T00:00:00.000Z",
            "isCompleted": false,
            "priority": "High",
            "project": 'portfolio',
            "startDate": "2025-02-28T00:00:00.000Z",
            "status": "Open",
            "type": "Bug"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02f0",
            "subject": "In access right module> school admin side",
            "assignTo": "Sagar Nalwa",
            "createdBy": "Pooja Bisht",
            "createdOn": "2025-02-28T12:29:34.664Z",
            "dueDate": "2025-02-28T00:00:00.000Z",
            "isCompleted": false,
            "priority": "High",
            "project": 'portfolio',
            "startDate": "2025-02-28T00:00:00.000Z",
            "status": "Open",
            "type": "Bug"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02f8",
            "subject": "In access right module> school admin side",
            "assignTo": "Sagar Nalwa",
            "createdBy": "Pooja Bisht",
            "createdOn": "2025-02-28T12:29:34.664Z",
            "dueDate": "2025-02-28T00:00:00.000Z",
            "isCompleted": false,
            "priority": "High",
            "project": 'portfolio',
            "startDate": "2025-02-28T00:00:00.000Z",
            "status": "Open",
            "type": "Bug"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02f2",
            "subject": "In access right module> school admin side",
            "assignTo": "Sagar Nalwa",
            "createdBy": "Pooja Bisht",
            "createdOn": "2025-02-28T12:29:34.664Z",
            "dueDate": "2025-02-28T00:00:00.000Z",
            "isCompleted": false,
            "priority": "High",
            "project": 'portfolio',
            "startDate": "2025-02-28T00:00:00.000Z",
            "status": "Open",
            "type": "Bug"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02fa",
            "subject": "Login issue on admin panel",
            "assignTo": "Ravi Kumar",
            "createdBy": "Neha Sharma",
            "createdOn": "2025-02-27T10:15:20.123Z",
            "dueDate": "2025-03-01T00:00:00.000Z",
            "isCompleted": true,
            "priority": "Medium",
            "project": 'portfolio',
            "startDate": "2025-02-27T00:00:00.000Z",
            "status": "Open",
            "type": "Bug"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02fb",
            "subject": "Payment gateway integration",
            "assignTo": "Priya Mehta",
            "createdBy": "Amit Singh",
            "createdOn": "2025-02-26T14:45:10.234Z",
            "dueDate": "2025-03-03T00:00:00.000Z",
            "isCompleted": false,
            "priority": "High",
            "project": 'portfolio',
            "startDate": "2025-02-26T00:00:00.000Z",
            "status": "In Progress",
            "type": "Feature"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02fc",
            "subject": "User profile update error",
            "assignTo": "Ankit Rawat",
            "createdBy": "Ritu Sharma",
            "createdOn": "2025-02-25T09:10:30.567Z",
            "dueDate": "2025-03-02T00:00:00.000Z",
            "isCompleted": false,
            "priority": "Low",
            "project": 'portfolio',
            "startDate": "2025-02-25T00:00:00.000Z",
            "status": "Open",
            "type": "Bug"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02fd",
            "subject": "Notification system enhancement",
            "assignTo": "Manoj Kumar",
            "createdBy": "Pooja Bisht",
            "createdOn": "2025-02-24T11:20:45.789Z",
            "dueDate": "2025-03-05T00:00:00.000Z",
            "isCompleted": false,
            "priority": "Medium",
            "project": 'portfolio',
            "startDate": "2025-02-24T00:00:00.000Z",
            "status": "In Progress",
            "type": "Feature"
        }
    ]

    const [customColumns, setCustomColumns] = useState(
        localStorage.getItem('customColumns') ? JSON.parse(localStorage.getItem('customColumns')) :
            Object.keys(initialData[0]).map(item => {
                switch (item) {
                    case 'subject': return { "subject": "Subject", "field": "text", "isActive": true }
                    case 'assignTo': return {
                        "assignTo": "Assignee", "field": "select", "isActive": true, "option": Array.from(new Set(initialData.flatMap(item =>
                            JSON.stringify({ label: item.assignTo, value: item.assignTo })
                        ))).map(item => JSON.parse(item))
                    }
                    case 'createdBy': return {
                        "createdBy": "Created By", "field": "select", "isActive": true, "option": Array.from(new Set(initialData.flatMap(item =>
                            JSON.stringify({ label: item.createdBy, value: item.createdBy })
                        ))).map(item => JSON.parse(item))
                    }
                    case 'project': return {
                        "project": "Project", "field": "select", "isActive": true, "option": Array.from(
                            new Map(projects.map(item => [item.name.toLowerCase(), { label: item.name, value: item.name.toLowerCase() }])).values()
                        )
                    }
                    case 'createdOn': return { "createdOn": "Created On", "field": "date", "isActive": true }
                    case 'dueDate': return { "dueDate": "Due Date", "field": "date", "isActive": true }
                    case 'priority': return { "priority": "Priority", "field": "select", "isActive": true, "option": ['High', 'Medium', 'Low'].map(item => ({ label: item, value: item })) }
                    case 'startDate': return { "startDate": "Start Date", "field": "date", "isActive": true }
                    case 'type': return { "type": "Type", "field": "select", "isActive": true, "option": ['Bug', 'Feature'].map(item => ({ label: item, value: item })) }
                    case 'status': return { "status": "Status", "field": "select", "isActive": true, "option": ['Open', 'In Progress', 'Closed'].map(item => ({ label: item, value: item })) }
                    default: return null;
                }
            }).filter(Boolean))



    const handleSubmit = (data) => {
        let newTask = {
            ...data,
            _id: Date.now(),
            isCompleted: false,
            createdOn: new Date().toISOString(),
            createdBy: 'Bhupendra'
        };
        addTask(newTask);
        setTaskForm({ open: false, id: null });
    }
    const [executed, setExecuted] = useState(false);
    useEffect(() => {
        if (!executed) {
        initialData.forEach((item) => addTask(item));
        setExecuted(true);
        }
    }, [])

    return (
        <div className="overflow-hidden">
            <div className="content-head flex flex-col sm:flex-row sm:items-center mb-3 mt-2 justify-between bg-white p-2 rounded">
                <h3 className="text-lg">Tasks</h3>
                <div className="content-head-right flex items-center">
                    <Button bgColor='bg-primary-10' textColor='text-primary' className="ml-2 bg-opacity-0 hover:bg-primary-20 border-primary border-1 transition-300" handleClick={() => setCustomColumnsOpen(true)}>
                        <i className='ph ph-faders-horizontal'></i>
                    </Button>
                    <Button bgColor='bg-primary-10' textColor='text-primary' className="ml-2 bg-opacity-0 hover:bg-primary-20 border-primary border-1 transition-300" handleClick={() => setTaskForm({ open: true, id: null })}>
                        <i className="ph ph-plus"></i>
                    </Button>
                </div>
            </div>
            <div className="bg-white p-3 rounded page overflow-x-auto">
                <Table customColumns={customColumns} />
            </div>
            {taskForm.open
                && <TaskForm taskId={taskForm.id} onClose={() => setTaskForm({ open: false, id: null })} onSubmit={handleSubmit} />}
            {customColumnsOpen && <CustomColumn columns={customColumns} setCustomColumns={setCustomColumns} onClose={() => setCustomColumnsOpen(false)} />

            }
        </div>
    )
}

export default Tasks