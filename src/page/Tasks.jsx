import React, { useEffect, useState } from 'react'
import Button from '../component/commonComponent/customFields/Button'
import Table from '../component/DraggableTable/Table';
import { useTask } from '../context/TaskContext/TaskContext';
import TaskForm from '../component/Tasks/TaskForm';


const Tasks = () => {
    const [taskForm, setTaskForm] = useState({
        open: false,
        id: null
    });
    const { addTask, deleteTask, updateTask, getTask } = useTask();
    const initialData = [
        {
            "_id": "67c1ac2e06a9aedcf9fd02f9",
            "subject": "In access right module> school admin side",
            "assigneeData": "Sagar Nalwa",
            "createdBy": "Pooja Bisht",
            "createdOn": "2025-02-28T12:29:34.664Z",
            "dueDate": "2025-02-28T00:00:00.000Z",
            "isCompleted": false,
            "priority": "High",
            "startDate": "2025-02-28T00:00:00.000Z",
            "status": "Open",
            "type": "Bug"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02f0",
            "subject": "In access right module> school admin side",
            "assigneeData": "Sagar Nalwa",
            "createdBy": "Pooja Bisht",
            "createdOn": "2025-02-28T12:29:34.664Z",
            "dueDate": "2025-02-28T00:00:00.000Z",
            "isCompleted": false,
            "priority": "High",
            "startDate": "2025-02-28T00:00:00.000Z",
            "status": "Open",
            "type": "Bug"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02f8",
            "subject": "In access right module> school admin side",
            "assigneeData": "Sagar Nalwa",
            "createdBy": "Pooja Bisht",
            "createdOn": "2025-02-28T12:29:34.664Z",
            "dueDate": "2025-02-28T00:00:00.000Z",
            "isCompleted": false,
            "priority": "High",
            "startDate": "2025-02-28T00:00:00.000Z",
            "status": "Open",
            "type": "Bug"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02f2",
            "subject": "In access right module> school admin side",
            "assigneeData": "Sagar Nalwa",
            "createdBy": "Pooja Bisht",
            "createdOn": "2025-02-28T12:29:34.664Z",
            "dueDate": "2025-02-28T00:00:00.000Z",
            "isCompleted": false,
            "priority": "High",
            "startDate": "2025-02-28T00:00:00.000Z",
            "status": "Open",
            "type": "Bug"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02fa",
            "subject": "Login issue on admin panel",
            "assigneeData": "Ravi Kumar",
            "createdBy": "Neha Sharma",
            "createdOn": "2025-02-27T10:15:20.123Z",
            "dueDate": "2025-03-01T00:00:00.000Z",
            "isCompleted": true,
            "priority": "Medium",
            "startDate": "2025-02-27T00:00:00.000Z",
            "status": "Open",
            "type": "Bug"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02fb",
            "subject": "Payment gateway integration",
            "assigneeData": "Priya Mehta",
            "createdBy": "Amit Singh",
            "createdOn": "2025-02-26T14:45:10.234Z",
            "dueDate": "2025-03-03T00:00:00.000Z",
            "isCompleted": false,
            "priority": "High",
            "startDate": "2025-02-26T00:00:00.000Z",
            "status": "In Progress",
            "type": "Feature"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02fc",
            "subject": "User profile update error",
            "assigneeData": "Ankit Rawat",
            "createdBy": "Ritu Sharma",
            "createdOn": "2025-02-25T09:10:30.567Z",
            "dueDate": "2025-03-02T00:00:00.000Z",
            "isCompleted": false,
            "priority": "Low",
            "startDate": "2025-02-25T00:00:00.000Z",
            "status": "Open",
            "type": "Bug"
        },
        {
            "_id": "67c1ac2e06a9aedcf9fd02fd",
            "subject": "Notification system enhancement",
            "assigneeData": "Manoj Kumar",
            "createdBy": "Pooja Bisht",
            "createdOn": "2025-02-24T11:20:45.789Z",
            "dueDate": "2025-03-05T00:00:00.000Z",
            "isCompleted": false,
            "priority": "Medium",
            "startDate": "2025-02-24T00:00:00.000Z",
            "status": "In Progress",
            "type": "Feature"
        }
    ]

    let customColumns = [
        { "subject": "Subject", "field": "text","isActive":false },
        {
            "assigneeData": "Assignee", "field": "select","isActive":true ,"option": Array.from(new Set(initialData.flatMap(item =>
                JSON.stringify({ label: item.assigneeData, value: item.assigneeData })
            ))).map(item => JSON.parse(item))
        },
        {
            "createdBy": "Created By", "field": "select","isActive":true, "option": Array.from(new Set(initialData.flatMap(item =>
                JSON.stringify({ label: item.createdBy, value: item.createdBy })
            ))).map(item => JSON.parse(item))
        },
        { "createdOn": "Created On", "field": "date","isActive":true },
        { "dueDate": "Due Date", "field": "date" ,"isActive":true},
        { "priority": "Priority", "field": "select", "isActive":true,"option": ['High', 'Medium', 'Low'].map(item => ({ label: item, value: item })) },
        { "startDate": "Start Date", "field": "date" ,"isActive":true },
        { "status": "Status", "field": "select","isActive":true, "option": ['New', 'InProgress', 'Completed'].map(item => ({ label: item, value: item })) },
        { "type": "Type", "field": "select","isActive":true, "option": ['Bug', 'Feature'].map(item => ({ label: item, value: item })) }
    ]


    const handleSubmit = (data) => {
        console.log(data);
    }

    useEffect(() => {
        initialData.forEach((item) => addTask(item));
    }, [])

    return (
        <div className="overflow-hidden">
            <div className="content-head flex flex-col sm:flex-row sm:items-center mb-3 mt-2 justify-between bg-white p-2 rounded">
                <h3 className="text-lg">Tasks</h3>
                <div className="content-head-right flex items-center">
                    <Button className="ml-2 hover:bg-white hover:text-primary border-primary border-1 transition-300">
                        <i className='ph ph-funnel'></i>
                    </Button>
                    <Button className="ml-2 hover:bg-white hover:text-primary border-primary border-1 transition-300" handleClick={() => setTaskForm({ open: true, id: null })}>
                        <i className="ph ph-plus"></i>
                    </Button>
                </div>
            </div>
            <div className="bg-white p-3 rounded page overflow-x-auto">
                <Table customColumns={customColumns} />
            </div>
            {taskForm.open
                && <TaskForm taskId={taskForm.id} onClose={() => setTaskForm({ open: false, id: null })} onSubmit={handleSubmit} />}
        </div>
    )
}

export default Tasks