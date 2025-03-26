import { Modal } from 'antd';
import { Button, Input, CustomMultiSelectField, Datepicker } from '../component/commonComponent/customFields';
import React, { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { NavLink } from 'react-router';

const UserProfile = () => {
    const [isModalOpen, setIsModalOpen] = useState({
        personalForm: false,
        SocicalForm: false
    });
    return (
        <div className="min-h-screen p-4 sm:p-6">
            {/* Header */}
            <div className="mb-4 flex flex-col justify-between rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-700 sm:flex-row sm:items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h3>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
                {/* Profile Summary */}
                <div className="col-span-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-700 sm:col-span-2 md:col-span-5">
                    <div className="flex flex-col gap-4 sm:flex-row items-start md:justify-between">
                        {/* Profile Image and Info */}
                        <div className="flex sm:w-1/2 w-full items-center gap-4">
                            <div className="w-20 flex-shrink-0">
                                <img
                                    src="https://dummyimage.com/64x82/000/fff"
                                    alt="User"
                                    className="h-full w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="space-y-1">
                                <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Bhupendra Kushwah</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Software Developer, Agami Technologies
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Year: 2023 - Present</p>
                                <NavLink to="/settings" className="flex items-center gap-1 text-sm text-blue-500 cursor-pointer hover:underline">
                                    <i className="ph ph-fingerprint"></i> Reset Password
                                </NavLink>
                            </div>
                        </div>
                        {/* Contact Info */}
                        <div className="grid sm:w-1/2 w-full grid-cols-1 gap-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                            <div className="flex items-center gap-2 truncate">
                                <i className="ph ph-envelope-simple text-teal-600 dark:text-teal-400"></i>
                                bhupendrakushwah977@gmail.com
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="ph ph-phone text-teal-600 dark:text-teal-400"></i>
                                9770239467
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="ph ph-code text-teal-600 dark:text-teal-400"></i>
                                OX578SO
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information (Left) */}
                <div className="col-span-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-700 sm:col-span-1 md:col-span-2 md:row-span-2">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-600">
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h5>
                        <button className="rounded-full p-1 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setIsModalOpen((prev) => ({ ...prev, personalForm: true }))}>
                            <i className="ph ph-pencil-simple-line text-teal-600 dark:text-teal-400"></i>
                        </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className='min-w-[45%]'>
                            <p className="font-medium">Gender</p>
                            <span className='text-gray-400'>Male</span>
                        </div>
                        <div className='min-w-[45%]'>
                            <p className="font-medium">Date of Birth</p>
                            <span className='text-gray-400'>January 1, 1995</span>
                        </div>
                        <div className='min-w-[45%]'>
                            <p className="font-medium">Registered Email</p>
                            <span className='text-gray-400'>codie.bhupendra@gmail.com</span>
                        </div>
                        <div className='min-w-[45%]'>
                            <p className="font-medium">Permanent Address</p>
                            <span className='text-gray-400'>Kushwah Colony, Pinto Park, Morar, Gwalior</span>
                        </div>
                        <div className='min-w-[45%]'>
                            <p className="font-medium">Residential Address</p>
                            <span className='text-gray-400'>Kushwah Colony, Pinto Park, Morar, Gwalior</span>
                        </div>
                    </div>
                </div>

                {/* Additional Info (Right) */}
                <div className="col-span-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-700 sm:col-span-1 md:col-span-3 md:row-span-2">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-600">
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h5>
                        <button className="rounded-full p-1 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <i className="ph ph-pencil-simple-line text-teal-600 dark:text-teal-400"></i>
                        </button>
                    </div>
                    <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Placeholder for additional details.</p>
                    </div>
                </div>

                {/* Social Networks */}
                <div className="col-span-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-700 sm:col-span-2 md:col-span-5">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-600">
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Social Networks</h5>
                        <button className="rounded-full p-1 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setIsModalOpen((prev) => ({ ...prev, SocicalForm: true }))}>
                            <i className="ph ph-plus-circle text-teal-600 dark:text-teal-400"></i>
                        </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4">
                        {[
                            { src: '/images/social/facebook.png', label: 'Facebook' },
                            { src: '/images/social/linkedin.png', label: 'LinkedIn' },
                            { src: '/images/social/x.png', label: 'X' },
                            { src: '/images/social/instagram.png', label: 'Instagram' },
                        ].map((social, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <img src={social.src} alt={social.label} className="h-6 w-6 rounded-full object-cover" />
                                <p className="text-sm font-semibold text-teal-600 hover:underline cursor-pointer">
                                    Connect
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <PersonalInfoForm isModalOpen={isModalOpen.personalForm} setIsModalOpen={setIsModalOpen} />
            <SocialMediaForm isModalOpen={isModalOpen.SocicalForm} setIsModalOpen={setIsModalOpen} />
        </div>
    );
};

export const PersonalInfoForm = ({ isModalOpen, setIsModalOpen }) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm();
    const [sameAsPermanent, setSameAsPermanent] = useState(false);
    const permanentAddress = watch("P_address"); // Watch Permanent Address

    const onSubmit = (data) => {
        console.log(data);
        setIsModalOpen({
            personalForm: false,
            SocicalForm: false
        });
    };
    const handleCancel = () => setIsModalOpen({
        personalForm: false,
        SocicalForm: false
    });;

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setSameAsPermanent(isChecked);

        if (isChecked) {
            setValue("R_Address", permanentAddress); // Copy value
        } else {
            setValue("R_Address", ""); // Clear value
        }
    };
    return (
        <div className="dark:bg-gray-900">
            <Modal
                title={<span className="text-gray-700 dark:text-gray-200">Edit Personal Information</span>}
                centered
                open={isModalOpen}
                onOk={handleSubmit(onSubmit)}
                onCancel={handleCancel}
                className="rounded-lg"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                footer={[
                    <Button key="cancel" className="px-4 py-2 rounded bg-white text-gray-500 border hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-400" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" className="px-4 py-2 mt-2 mx-2 rounded bg-teal-500 text-white hover:bg-teal-700 dark:bg-emerald-600 dark:hover:bg-emerald-700" onClick={handleSubmit(onSubmit)}>
                        Save
                    </Button>,
                ]}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-4 rounded-lg flex flex-wrap justify-between items-center gap-4">
                    {[
                        { name: "name", label: "Name", type: "text" },
                        { name: "Designation", label: "Designation", type: "text" },
                        { name: "email", label: "Email", type: "email" },
                        { name: "Phone", label: "Phone", type: "text" },
                    ].map(({ name, label, type }) => (
                        <div key={name} className='w-[45%]'>
                            <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">{label}</label>
                            <Controller
                                name={name}
                                control={control}
                                rules={{ required: `${label} is required!` }}
                                render={({ field }) => (
                                    <Input {...field} type={type} placeholder={`Enter your ${label}`} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                                )}
                            />
                            {errors[name] && <p className="text-red-500 text-sm">{errors[name].message}</p>}
                        </div>
                    ))}

                    <div className='w-[45%]'>
                        <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">Gender</label>
                        <Controller
                            name="Gender"
                            control={control}
                            rules={{ required: "Gender is required!" }}
                            render={({ field }) => (
                                <CustomMultiSelectField {...field} options={[{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }]} />
                            )}
                        />
                        {errors.Gender && <p className="text-red-500 text-sm">{errors.Gender.message}</p>}
                    </div>

                    <div className='w-[45%]'>
                        <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">Date of Birth</label>
                        <Controller
                            name="DOB"
                            control={control}
                            rules={{ required: "Date of Birth is required!" }}
                            render={({ field }) => <Datepicker onDateChange={field.onChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />}
                        />
                        {errors.DOB && <p className="text-red-500 text-sm">{errors.DOB.message}</p>}
                    </div>

                    {[
                        { name: "P_address", label: "Permanent Address" },
                        { name: "R_Address", label: "Residential Address" },
                    ].map(({ name, label }) => (
                        <div key={name} className="mb-4 w-[45%]">
                            <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">{label}</label>
                            <Controller
                                name={name}
                                control={control}
                                rules={{ required: `${label} is required!` }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder={`Enter your ${label}`}
                                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                        disabled={name === "R_Address" && sameAsPermanent}
                                        value={name === "R_Address" && sameAsPermanent ? watch("P_address") : field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                )}
                            />
                            {(errors[name] && !sameAsPermanent) && <p className="text-red-500 text-sm">{errors[name].message}</p>}
                        </div>
                    ))}

                    <div className="col-span-2 flex items-center gap-2">
                        <input type="checkbox" {...register("sameAsPermanentAddress")} onChange={(e) => handleCheckboxChange(e)} />
                        <label className="text-gray-700 dark:text-gray-200">Same as Permanent Address</label>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export const SocialMediaForm = ({ isModalOpen, setIsModalOpen }) => {
    const { handleSubmit, control, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Social Media Links:", data);
        setIsModalOpen({
            personalForm: false,
            SocicalForm: false
        });
    };
    const handleCancel = () => {
        setIsModalOpen({
            personalForm: false,
            SocicalForm: false
        });
    };

    return (
        <div className="dark:bg-gray-900">
            <Modal
                title={<span className="text-gray-700 dark:text-gray-200">Edit Social Media Links</span>}
                centered
                open={isModalOpen}
                onOk={handleSubmit(onSubmit)}
                onCancel={handleCancel}
                className="rounded-lg"
                footer={[
                    <Button
                        key="cancel"
                        className="px-4 py-2 rounded bg-white text-gray-500 border border-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-400 dark:hover:bg-gray-900"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        className="px-4 py-2 mt-2 mx-2 rounded bg-teal-500 text-white border border-emerald-500 hover:bg-teal-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Save
                    </Button>,
                ]}
                width={{ xs: "90%", sm: "80%", md: "70%", lg: "60%", xl: "50%", xxl: "40%" }}
            >
                <div className="bg-white dark:bg-gray-800 p-4 rounded-b-lg">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-wrap justify-between items-center w-full">
                            {[
                                { name: "facebook", label: "Facebook URL" },
                                { name: "instagram", label: "Instagram URL" },
                                { name: "twitter", label: "Twitter URL" },
                                { name: "linkedin", label: "LinkedIn URL" },
                            ].map(({ name, label }) => (
                                <div key={name} className="mb-4 w-[45%]">
                                    <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">{label}</label>
                                    <Controller
                                        name={name}
                                        control={control}
                                        rules={{
                                            required: `${label} is required!`,
                                            pattern: {
                                                value: /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/[\w.-]*)*\/?$/,
                                                message: "Enter a valid URL!",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="url"
                                                placeholder={`Enter your ${label}`}
                                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                            />
                                        )}
                                    />
                                    {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};



export default UserProfile;