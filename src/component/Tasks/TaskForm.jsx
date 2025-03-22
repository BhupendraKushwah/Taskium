import React from 'react';
import { Button, Input, CustomMultiSelectField, Datepicker } from '../commonComponent/customFields';
import { Controller, useForm } from 'react-hook-form';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import CustomEditor from '../commonComponent/customEditor/Editor';
import { useProject } from '../../context/ProjectContext/ProjectContext';

const TaskForm = ({ task, onClose, onSubmit }) => {
    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            assignTo: task?.assignTo || '',
            description: task?.description || '',
            dueDate: task?.dueDate || '',
            estimatedTime: task?.estimatedTime || '',
            priority: task?.priority || '',
            startDate: task?.startDate || '',
            status: task?.status || '',
            subject: task?.subject || '',
            type: task?.type || '',
            project: task?.project || '',
        }
    });
    const { projects } = useProject();
    const users = [
        { label: "Priya Mehta", value: "Priya Mehta" },
        { label: "Ankit Rawat", value: "Ankit Rawat" },
        { label: "Pooja Bisht", value: "Pooja Bisht" },
        { label: "Amit Singh", value: "Amit Singh" },
        { label: "Ritu Sharma", value: "Ritu Sharma" },
        { label: "Manoj Kumar", value: "Manoj Kumar" },
    ];
    const projectData = Array.from(
        new Map(projects.map(project =>
            [project.name, { label: project.name, value: project._id }]
        )).values()
    );
      
    const taskType = [
        { label: "Bug", value: "Bug" },
        { label: "Feature", value: "Feature" },
        { label: "Implementation", value: "Implementation" },
    ];

    const statusOption = [
        { label: 'Open', value: 'Open' },
        { label: 'Closed', value: 'Closed' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Rejected', value: 'Rejected' },
        { label: 'Hold', value: 'Hold' }
    ];

    const priorityOption = [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' },
        { label: 'Critical', value: 'Critical' }
    ];

    return (
        <div className="w-full h-full fixed top-18 left-0 bg-[#0000004d] dark:bg-[#00000080] flex justify-end z-50">
            <div className="w-3/4 sm:w-3/4 md:w-3/4 lg:w-1/2 h-[calc(100vh-72px)] bg-white dark:bg-gray-800 shadow-lg p-5 overflow-y-auto dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2 flex justify-end">
                    <button onClick={onClose} className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                        <i className="ph ph-arrow-line-right text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Subject */}
                    <div className='relative'>
                        <label className="text-gray-400 dark:text-gray-500 text-sm">Subject</label>
                        <Controller
                            name="subject"
                            control={control}
                            rules={{ required: 'Subject is required!' }}
                            render={({ field: { onChange } }) => (
                                <Input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-200 dark:placeholder-gray-500"
                                    placeholder="Enter subject..."
                                    onChange={onChange}
                                />
                            )}
                        />
                        {errors.subject && (
                            <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs rounded-md shadow-sm animate-bounceIn">
                                {errors.subject.message}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        {/* Assign To */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 dark:text-gray-500 text-sm">Assign To</label>
                            <Controller
                                name="assignTo"
                                control={control}
                                rules={{ required: 'Assign To is required!' }}
                                render={({ field }) => (
                                    <CustomMultiSelectField
                                        ref={field.ref}
                                        options={users}
                                        onChange={(selected) => field.onChange(selected.value)}
                                        placeholder="Select"
                                        className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                    />
                                )}
                            />
                            {errors.assignTo && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.assignTo.message}
                                </div>
                            )}
                        </div>

                        {/* Project */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 dark:text-gray-500 text-sm">Project</label>
                            <Controller
                                name="project"
                                control={control}
                                rules={{ required: 'Project is required!' }}
                                render={({ field }) => (
                                    <CustomMultiSelectField
                                        ref={field.ref}
                                        options={projectData}
                                        onChange={(selected) => field.onChange(selected.value)}
                                        placeholder="Select"
                                        className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                    />
                                )}
                            />
                            {errors.project && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.project.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {/* Status */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 dark:text-gray-500 text-sm">Status</label>
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: 'Status is required!' }}
                                render={({ field }) => (
                                    <CustomMultiSelectField
                                        ref={field.ref}
                                        options={statusOption}
                                        onChange={(selected) => field.onChange(selected.value)}
                                        placeholder="Select"
                                        className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                    />
                                )}
                            />
                            {errors.status && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.status.message}
                                </div>
                            )}
                        </div>

                        {/* Priority */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 dark:text-gray-500 text-sm">Priority</label>
                            <Controller
                                name="priority"
                                control={control}
                                rules={{ required: 'Priority is required!' }}
                                render={({ field }) => (
                                    <CustomMultiSelectField
                                        ref={field.ref}
                                        options={priorityOption}
                                        onChange={(selected) => field.onChange(selected.value)}
                                        placeholder="Select"
                                        className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                    />
                                )}
                            />
                            {errors.priority && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.priority.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {/* Start Date */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 dark:text-gray-500 text-sm">Start Date</label>
                            <Controller
                                name="startDate"
                                control={control}
                                rules={{ required: 'Start Date is required!' }}
                                render={({ field }) => (
                                    <Datepicker
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-200 dark:placeholder-gray-500"
                                        ref={field.ref}
                                        onDateChange={field.onChange}
                                        placeholder="Start date"
                                    />
                                )}
                            />
                            {errors.startDate && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.startDate.message}
                                </div>
                            )}
                        </div>

                        {/* Due Date */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 dark:text-gray-500 text-sm">Due Date</label>
                            <Controller
                                name="dueDate"
                                control={control}
                                rules={{ required: 'Due Date is required!' }}
                                render={({ field }) => (
                                    <Datepicker
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-200 dark:placeholder-gray-500"
                                        ref={field.ref}
                                        onDateChange={field.onChange}
                                        placeholder="Due date"
                                    />
                                )}
                            />
                            {errors.dueDate && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.dueDate.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {/* Estimated Time */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 dark:text-gray-500 text-sm">Estimated Time</label>
                            <div className="w-full">
                                <Controller
                                    name='estimatedTime'
                                    control={control}
                                    rules={{ required: 'Estimated Time is required!' }}
                                    render={({ field }) => (
                                        <TimePicker
                                            ref={field.ref}
                                            onChange={time => field.onChange(time ? dayjs(time).format("HH:mm:ss") : "")}
                                            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-200 dark:placeholder-gray-500 antd-timepicker-dark"
                                        />
                                    )}
                                />
                                {errors.estimatedTime && (
                                    <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs rounded-md shadow-sm animate-bounceIn">
                                        {errors.estimatedTime.message}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Type */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 dark:text-gray-500 text-sm">Type</label>
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: 'Type is required!' }}
                                render={({ field }) => (
                                    <CustomMultiSelectField
                                        ref={field.ref}
                                        options={taskType}
                                        onChange={(selected) => field.onChange(selected.value)}
                                        placeholder="Select"
                                        className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                    />
                                )}
                            />
                            {errors.type && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.type.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="relative w-full">
                        <label className="text-gray-400 dark:text-gray-500 text-sm">Description</label>
                        <CustomEditor
                            rules={{ required: 'Description is required!' }}
                            control={control}
                            name={'description'}
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                        {errors.description && (
                            <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs rounded-md shadow-sm animate-bounceIn">
                                {errors.description.message}
                            </div>
                        )}
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-between mt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            bgColor="bg-white dark:bg-gray-700"
                            textColor="text-teal-600 dark:text-teal-300"
                            className="px-3 py-1 border border-teal-600 dark:border-teal-300 rounded hover:shadow-md hover:bg-teal-600 dark:hover:bg-teal-700 hover:text-white dark:hover:text-white transition duration-300"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            bgColor="bg-teal-600 dark:bg-teal-500"
                            textColor="text-white"
                            className="px-5 py-1 rounded hover:bg-teal-700 dark:hover:bg-teal-600 transition duration-300"
                        >
                            Add
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;