import React, { useEffect, useState } from 'react'
import Button from '../component/commonComponent/customFields/Button'
import Table from '../component/DraggableTable/Table';
import { useTask } from '../context/TaskContext/TaskContext';


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
        { "assigneeData": "Assignee", "field": "select", "option": Array.from(new Set(initialData.flatMap(item => 
            JSON.stringify({ label: item.assigneeData, value: item.assigneeData })
          ))).map(item => JSON.parse(item))
 },
        { "createdBy": "Created By", "field": "select", "option": Array.from(new Set(initialData.flatMap(item => 
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

const TaskForm = () => {
    return (
        <div className="w-full h-full fixed top-18 left-0 bg-[#0000004d] flex justify-end">
            <div className="w-3/4 sm:w-1/2 md:w-1/2 lg:w-1/4 h-[calc(100vh-72px)] bg-white shadow-lg p-5 overflow-y-auto">
                <div className="border-b border-gray-200 pb-2 flex justify-end">
                    <button onClick={onClose} className="cursor-pointer text-gray-600 hover:text-black">
                        <i className="ph ph-arrow-line-right text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Project Name */}
                    <div>
                        <label className="text-gray-400 text-sm">Project Name</label>
                        <Input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded placeholder-gray-200"
                            placeholder="Enter project name"
                        />
                    </div>

                    {/* Project Description */}
                    <div>
                        <label className="text-gray-400 text-sm">Project Description</label>
                        <Input
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded placeholder-gray-200"
                            placeholder="Describe the project..."
                        />
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="text-gray-400 text-sm">Start Date</label>
                        <Datepicker
                            defaultValue={dayjs(formData.startDate)}
                            onChange={handleDateChange}
                            className="w-full p-2 border rounded border-red"
                        />
                    </div>

                    {/* Team Members */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-gray-400 text-sm">Team Members</label>
                            <div className="flex items-center justify-end">
                                <Button
                                    type="button"
                                    onClick={e => addTeamMember(e)}
                                    bgColor="bg-white"
                                    textColor="text-primary"
                                    className="mt-2 text-primary border-primary border-1 rounded px-1 cursor-pointer hover:bg-primary hover:text-white transition duration-300"
                                >
                                    <i className="ph ph-plus text-sm"></i>
                                </Button>
                            </div>
                        </div>
                        {formData.teamMembers.map((member, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <CustomMultiselect
                                    options={teamDesignation}
                                    placeholder="Role"
                                    onChange={(e) => handleTeamChange(index, "role", e.value)}
                                    className="w-1/2 border rounded placeholder-gray-200 z-[1]"
                                />
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    value={member.name}
                                    onChange={(e) => handleTeamChange(index, "name", e.target.value)}
                                    className="w-full border rounded placeholder-gray-200"
                                />
                                {formData.teamMembers.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeTeamMember(index)}
                                        bgColor="bg-white"
                                        textColor="text-red-500"
                                        className="p-1 rounded border-red border-1 cursor-pointer hover:bg-red-500 hover:text-white transition duration-300"
                                    >
                                        <i className="ph ph-trash text-sm"></i>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Message */}
                    <div>
                        <label className="text-gray-400 text-sm">Message</label>
                        <Input
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Write a message..."
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