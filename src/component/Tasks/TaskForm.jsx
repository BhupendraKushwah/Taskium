import React  from 'react'
import Button from '../commonComponent/customFields/Button'
import Input from '../commonComponent/customFields/Input';
import CustomMultiSelectField from '../commonComponent/customFields/CustomMultiSelectField';
import { Controller, useForm } from 'react-hook-form';
import CustomDatepicker from '../commonComponent/customFields/Datepicker';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import CustomEditor from '../commonComponent/customEditor/Editor';

const TaskForm = ({ task, onClose, onSubmit }) => {
    const { handleSubmit, control, formState: { errors }, } = useForm({
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
                    <div className='relative'>
                        <label className="text-gray-400 text-sm">Subject</label>
                        <Controller
                            name="subject"
                            control={control}
                            rules={{ required: 'Subject is required!' }}
                            render={({ field: { onChange } }) => (
                                <Input
                                    type="text"
                                    className="w-full p-2 border rounded placeholder-gray-200"
                                    placeholder="Enter subject..."
                                    onChange={onChange}
                                />
                            )}
                        />
                        {errors.subject && (
                            <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md shadow-sm animate-bounceIn">
                                {errors.subject.message}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        {/* Assign To */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 text-sm">Assign To</label>
                            <Controller
                                name="assignTo"
                                control={control}
                                rules={{ required: 'Assign To is required!' }}
                                render={({ field }) => (
                                    <CustomMultiSelectField
                                        ref={field.ref} // Here is the ref binding 🔥
                                        options={users}
                                        onChange={field.onChange}
                                        placeholder="Select"
                                    />
                                )}
                            />
                            {errors.assignTo && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.assignTo.message}
                                </div>
                            )}
                        </div>

                        {/* Type */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 text-sm">Type</label>
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: 'Type is required!' }}
                                render={({ field }) => (
                                    <CustomMultiSelectField
                                        ref={field.ref}
                                        options={taskType}
                                        onChange={field.onChange}
                                        placeholder="Select"
                                    />
                                )}
                            />
                            {errors.type && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.type.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {/* Status */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 text-sm">Status</label>
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: 'Status is required!' }}
                                render={({ field }) => (
                                    <CustomMultiSelectField
                                        ref={field.ref} // Here is the ref binding 🔥
                                        options={statusOption}
                                        onChange={field.onChange}
                                        placeholder="Select"
                                    />
                                )}
                            />
                            {errors.status && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.status.message}
                                </div>
                            )}
                        </div>

                        {/* Priority */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 text-sm">Priority</label>
                            <Controller
                                name="priority"
                                control={control}
                                rules={{ required: 'Priority is required!' }}
                                render={({ field }) => (
                                    <CustomMultiSelectField
                                        ref={field.ref}
                                        options={priorityOption}
                                        onChange={field.onChange}
                                        placeholder="Select"
                                    />
                                )}
                            />
                            {errors.priority && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.priority.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {/* Start Date */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 text-sm">Start Date</label>
                            <Controller
                                name="startDate"
                                control={control}
                                rules={{ required: 'Start Date is required!' }}
                                render={({ field }) => (
                                    <CustomDatepicker
                                        className="w-full"
                                        ref={field.ref}
                                        onDateChange={field.onChange}
                                        placeholder="Start date"
                                    />
                                )}
                            />
                            {errors.startDate && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.startDate.message}
                                </div>
                            )}
                        </div>

                        {/* Due Date */}
                        <div className='relative w-1/2'>
                            <label className="text-gray-400 text-sm">Due Date</label>
                            <Controller
                                name="dueDate"
                                control={control}
                                rules={{ required: 'Due Date is required!' }}
                                render={({ field }) => (
                                    <CustomDatepicker
                                        className="w-full"
                                        ref={field.ref}
                                        onDateChange={field.onChange}
                                        placeholder="Due date"
                                    />
                                )}
                            />
                            {errors.dueDate && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.dueDate.message}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Estimated Time */}
                    <div className='relative w-full'>
                        <label className="text-gray-400 text-sm">Estimated Time</label>
                        <div className="w-full">
                            <Controller
                                name='estimatedTime'
                                control={control}
                                rules={{ required: 'Estimated Time is required!' }}
                                render={({ field }) => (
                                    <TimePicker
                                        ref={field.ref}
                                        onChange={time => field.onChange(time ? dayjs(time).format("HH:mm:ss") : "")}
                                        className="w-full p-3 border rounded placeholder-gray-200"
                                    />
                                )}
                            />
                            {errors.estimatedTime && (
                                <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md shadow-sm animate-bounceIn">
                                    {errors.estimatedTime.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="relative w-full">

                        <label className="text-gray-400 text-sm">Description</label>
                        <CustomEditor
                            rules={{ required: 'Description is required!' }}
                            control={control}
                            name={'description'}
                        />
                        {errors.description && (
                            <div className="absolute -top-2 left-0 mt-1 ml-2 px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md shadow-sm animate-bounceIn">
                                {errors.description.message}
                            </div>
                        )}

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

export default TaskForm;