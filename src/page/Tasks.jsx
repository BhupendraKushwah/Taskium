import React, { useEffect, useState } from 'react'
import Button from '../component/commonComponent/customFields/Button'
import Table from '../component/DraggableTable/Table';
import { useTask } from '../context/TaskContext/TaskContext';
import Input from '../component/commonComponent/customFields/Input';
import CustomMultiSelectField from '../component/commonComponent/customFields/CustomMultiSelectField';
import { Controller, useForm } from 'react-hook-form';
import CustomDatepicker from '../component/commonComponent/customFields/Datepicker';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import CustomEditor from '../component/commonComponent/customEditor/Editor';


const Tasks = () => {
    const [isTaskOpen, setIsTaskOpen] = useState(false);
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
        { "subject": "Subject", "field": "text" },
        {
            "assigneeData": "Assignee", "field": "select", "option": Array.from(new Set(initialData.flatMap(item =>
                JSON.stringify({ label: item.assigneeData, value: item.assigneeData })
            ))).map(item => JSON.parse(item))
        },
        {
            "createdBy": "Created By", "field": "select", "option": Array.from(new Set(initialData.flatMap(item =>
                JSON.stringify({ label: item.createdBy, value: item.createdBy })
            ))).map(item => JSON.parse(item))
        },
        { "createdOn": "Created On", "field": "date" },
        { "dueDate": "Due Date", "field": "date" },
        { "priority": "Priority", "field": "select", "option": ['High', 'Medium', 'Low'].map(item => ({ label: item, value: item })) },
        { "startDate": "Start Date", "field": "date" },
        { "status": "Status", "field": "select", "option": ['New', 'InProgress', 'Completed'].map(item => ({ label: item, value: item })) },
        { "type": "Type", "field": "select", "option": ['Bug', 'Feature'].map(item => ({ label: item, value: item })) }
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
                    <Button className="ml-2 hover:bg-white hover:text-primary border-primary border-1 transition-300" handleClick={() => setIsTaskOpen(true)}>
                        <i className="ph ph-plus"></i>
                    </Button>
                </div>
            </div>
            <div className="bg-white p-3 rounded page overflow-x-auto">
                <Table customColumns={customColumns} />
            </div>
            {isTaskOpen && <TaskForm onClose={() => setIsTaskOpen(false)} onSubmit={handleSubmit} />}
        </div>
    )
}

const TaskForm = ({ task,onClose, onSubmit }) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues:{
        assignTo: task?.assignTo || '',
        description: task?.description || '',
        dueDate: task?.dueDate || '',
        estimatedTime: task?.estimatedTime || '',
        priority: task?.priority || '',
        startDate: task?.startDate || '',
        status: task?.status || '',
        subject: task?.subject || '',
        type: task?.type || '',
    }
})
    const users = [
        { label: "Priya Mehta", value: "Priya Mehta" },
        { label: "Ankit Rawat", value: "Ankit Rawat" },
        { label: "Pooja Bisht", value: "Pooja Bisht" },
        { label: "Amit Singh", value: "Amit Singh" },
        { label: "Ritu Sharma", value: "Ritu Sharma" },
        { label: "Manoj Kumar", value: "Manoj Kumar" },
    ]

    const taskType = [
        { label: "Bug", value: "Bug" },
        { label: "Feature", value: "Feature" },
        { label: "Implementation", value: "Implementation" },
    ]

    const statusOption = [
        { label: 'Open', value: 'Open' },
        { label: 'Closed', value: 'Closed' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Rejected', value: 'Rejected' },
        { label: 'Hold', value: 'Hold' }
    ]

    const priorityOption = [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' },
        { label: 'Critical', value: 'Critical' }
    ]

    return (
        <div className="w-full h-full fixed top-18 left-0 bg-[#0000004d] flex justify-end">
            <div className="w-3/4 sm:w-3/4 md:w-3/4 lg:w-1/2 h-[calc(100vh-72px)] bg-white shadow-lg p-5 overflow-y-auto">
                <div className="border-b border-gray-200 pb-2 flex justify-end">
                    <button onClick={onClose} className="cursor-pointer text-gray-600 hover:text-black">
                        <i className="ph ph-arrow-line-right text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Subject */}
                    <div>
                        <label className="text-gray-400 text-sm">Subject</label>
                        <Controller
                            name="subject"
                            control={control}
                            render={({ field: { onChange} }) => (
                                <Input
                                    type="text"
                                    className="w-full p-2 border rounded placeholder-gray-200"
                                    placeholder="Enter subject..."
                                    onChange={onChange}
                                />
                            )}
                        />
                    </div>
                    <div className="flex gap-4">
                        {/* Assign To */}
                        <div className='w-1/2'>
                            <label className="text-gray-400 text-sm">Assign To</label>
                            <Controller
                                name="assignTo"
                                control={control}
                                render={({ field }) => (
                                    <CustomMultiSelectField
                                        ref={field.ref} // Here is the ref binding 🔥
                                        options={users}
                                        onChange={field.onChange}
                                        placeholder="Select"
                                    />
                                )}
                            />
                        </div>

                        {/* Type */}
                        <div className='w-1/2'>
                            <label className="text-gray-400 text-sm">Type</label>
                            <Controller
                                name="type"
                                control={control}
                                // rules={{ required: "Assign To is required" }}
                                render={({ field }) => (
                                    <CustomMultiSelectField
                                        ref={field.ref}
                                        options={taskType}
                                        onChange={field.onChange}
                                        placeholder="Select"
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {/* Status */}
                        <div className='w-1/2'>
                            <label className="text-gray-400 text-sm">Status</label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <CustomMultiSelectField
                                        ref={field.ref} // Here is the ref binding 🔥
                                        options={statusOption}
                                        onChange={field.onChange}
                                        placeholder="Select"
                                    />
                                )}
                            />
                        </div>

                        {/* Priority */}
                        <div className='w-1/2'>
                            <label className="text-gray-400 text-sm">Priority</label>
                            <Controller
                                name="priority"
                                control={control}
                                // rules={{ required: "Assign To is required" }}
                                render={({ field }) => (
                                    <CustomMultiSelectField
                                        ref={field.ref}
                                        options={priorityOption}
                                        onChange={field.onChange}
                                        placeholder="Select"
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {/* Start Date */}
                        <div className='w-1/2'>
                            <label className="text-gray-400 text-sm">Start Date</label>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <CustomDatepicker
                                        className="w-full"
                                        ref={field.ref}
                                        onDateChange={field.onChange}
                                        placeholder="Start date"
                                    />
                                )}
                            />
                        </div>

                        {/* Due Date */}
                        <div className='w-1/2'>
                            <label className="text-gray-400 text-sm">Due Date</label>
                            <Controller
                                name="dueDate"
                                control={control}
                                // rules={{ required: "Assign To is required" }}
                                render={({ field }) => (
                                    <CustomDatepicker
                                        className="w-full"
                                        ref={field.ref}
                                        onDateChange={field.onChange}
                                        placeholder="Due date"
                                    />
                                )}
                            />
                        </div>
                    </div>
                    {/* Estimated Time */}
                    <div className='w-full'>
                        <label className="text-gray-400 text-sm">Estimated Time</label>
                        <div className="w-full">
                            <Controller
                                name='estimatedTime'
                                control={control}
                                render={({ field }) => (
                                    <TimePicker
                                        ref={field.ref}
                                        onChange={time => field.onChange(time ? dayjs(time).format("HH:mm:ss") : "")}
                                        className="w-full p-3 border rounded placeholder-gray-200"
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="w-full">
                    
                        <label className="text-gray-400 text-sm">Description</label>
                        <CustomEditor
                            control={control}
                            name={'description'}
                        />
                        
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-between mt-4">
                        <Button
                            type="Button"
                            onClick={onClose}
                            bgColor="bg-white-300"
                            textColor="text-primary"
                            className="px-3 py-1 border border-2 rounded hover:shadow-md hover:border-white transition duration-150"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="px-5 py-1 text-white rounded"
                        >
                            Add
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Tasks