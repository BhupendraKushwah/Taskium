import { useEffect, useState } from "react";
import { CustomSearchField, Button, Input, Datepicker, CustomMultiSelectField } from "../component/commonComponent/customFields/";
import ProjectDetails from "../component/projects/ProjectData";
import dayjs from "dayjs";
import { useProject } from "../context/ProjectContext/ProjectContext";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { focusOptions, statusOptions, teamDesignation } from "../constants/common";
import useApi from "../hooks/instance";
import PreviewModal from "../component/commonComponent/common/PreviewModal";
import { getImage } from "../component/commonComponent/common";

const Projects = () => {
    const { projects, addProjects,getProjects,hasMore } = useProject();
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [search, setSearch] = useState({});
    const [isSideFormOpen, setIsSideFormOpen] = useState(false);
    const [previewModel, setPreviewModel] = useState({
        isOpen: false,
        file: null
    });

    const handleAsyncChange = async (value) => {
        setSearch({ projectName: value });
        await getProjects({ projectName: value });
        setFilteredProjects(
            projects.filter(item =>
                item.projectName.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    const handleSubmit = async (value) => {
        addProjects(value);
        setIsSideFormOpen(false);
    };

    const handlePreview = (img) => {
        if (!img) return;

        const extension = img.split('.').pop();
        const fileData = {
            src: getImage('project/large', img),
            mimetype: `image/${extension}`,
            title: img
        }

        setPreviewModel({
            isOpen: true,
            file: fileData
        });
    }

    const handleScroll =async (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && hasMore) {
            getProjects(search);
        }
    }
    useEffect(() => {
        if (Object.keys(search).length > 0) {
            setFilteredProjects(
                projects.filter(item =>
                    item.projectName.toLowerCase().includes(search.projectName.toLowerCase())
                )
            );
        } else {
            setFilteredProjects(projects);
        }
    }, [projects, search]);

    return (
        <div className="dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
            <div className="content-head flex flex-col sm:flex-row sm:items-center mb-3 mt-2 justify-between bg-white dark:bg-gray-800 p-2 rounded dark:border-gray-700">
                <h3 className="text-lg text-gray-900 dark:text-white">Projects</h3>
                <div className="content-head-right flex items-center">
                    <CustomSearchField
                        onChange={handleAsyncChange}
                        value={search.projectName}
                        placeholder="Search here"
                        className="bg-white dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                    />
                    <Button
                        className="ml-2 sm:flex block items-center bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-800"
                        handleClick={() => setIsSideFormOpen(true)}
                    >
                        <i className="ph ph-plus"></i>
                        <span className="sm:inline hidden">Project</span>
                    </Button>
                </div>
            </div>

            <div className={`overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 p-3 rounded h-[calc(100vh-100px)]`} onScroll={handleScroll}>
                {filteredProjects?.length ? (
                    filteredProjects.map(project => (
                        <div key={project.id}>
                            <ProjectDetails project={project} handlePreview={handlePreview} />
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center min-h-full w-full col-span-full">
                        <p className="text-2xl text-center text-gray-400 dark:text-gray-500">No projects found</p>
                    </div>
                )}
            </div>

            {isSideFormOpen && <ProjectForm onClose={() => setIsSideFormOpen(false)} onSubmit={handleSubmit} />}
            <PreviewModal
                mimetype={previewModel.file?.mimetype}
                src={previewModel.file?.src}
                isOpen={previewModel.isOpen}
                onClose={() => setPreviewModel({ isOpen: false })}
                title={previewModel.file?.title}
            />
        </div>
    );
};

const ProjectForm = ({ onClose, onSubmit, project }) => {
    const {
        control,
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            projectName: project?.projectName || "",
            image: project?.image || "",
            focus: project?.focus || focusOptions.find(option => option.value === 'design')?.value || "",
            status: project?.status || "",
            startDate: project?.startDate ? dayjs(project.startDate) : dayjs(),
            teamMembers: project?.teamMembers || [{ name: "", role: "" }],
        },
    });

    const [teamUser, setTeamUser] = useState([]);
    const [image, setImage] = useState(null);

    const api = useApi();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "teamMembers",
    });

    const getUsers = async () => {
        try {
            const response = await api.get('/settings/get-users');
            setTeamUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }


    const submitForm = (data) => {
        if (image instanceof File) {
            data['image'] = image;
        } else if (project?.image) {
            data['projectImage'] = project.image;
        }
        onSubmit({
            ...data,
            teamMembers: data.teamMembers.map((member, index) => ({
                name: member.name,
                teamName: teamUser.find(user => user.value === member.name).label,
                role: member.role
            })),
            startDate: data.startDate.toISOString(), // Convert to ISO string for consistency
            dueDate: data.dueDate.toISOString(), // Convert to ISO string for consistency
        });
        // onClose();
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="w-full h-full fixed top-18 left-0 bg-[#0000004d] dark:bg-[#00000080] flex justify-end z-50">
            <div className="w-3/4 sm:w-1/2 md:w-1/2 lg:w-1/3 h-[calc(100vh-72px)] bg-white dark:bg-gray-800 shadow-lg p-5 overflow-y-auto dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2 flex justify-end">
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                    >
                        <i className="ph ph-arrow-line-right text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4 mt-4">
                    {/* Project Name */}
                    <div>
                        <label htmlFor="projectName" className="block text-sm text-gray-400 dark:text-gray-500">
                            Project Name
                        </label>
                        <Controller
                            name="projectName"
                            control={control}
                            rules={{ required: "Project name is required" }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="projectName"
                                    type="text"
                                    placeholder="Enter project name"
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                />
                            )}
                        />
                        {errors.projectName && (
                            <p className="text-red-500 text-xs mt-1">{errors.projectName.message}</p>
                        )}
                    </div>

                    {/* Image */}
                    <div>
                        <label
                            htmlFor="image"
                            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Upload Image
                        </label>

                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setImage(e.target.files[0]);
                            }}
                            className="block cursor-pointer w-full text-sm text-gray-900 dark:text-gray-200 file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0 file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                                dark:file:bg-gray-600 dark:file:text-gray-100 dark:hover:file:bg-gray-500"
                        />

                        {errors.image && (
                            <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>
                        )}
                    </div>

                    {/* Focus */}
                    <div>
                        <label htmlFor="focus" className="block text-sm text-gray-400 dark:text-gray-500">
                            Focus
                        </label>
                        <Controller
                            name="focus"
                            control={control}
                            rules={{ required: "Focus is required" }}
                            render={({ field }) => (
                                <CustomMultiSelectField
                                    {...field}
                                    id="focus"
                                    options={focusOptions}
                                    placeholder="Select focus"
                                    onChange={(selected) => field.onChange(selected?.value)}
                                    value={focusOptions.find(opt => opt.value === field.value) || null}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 text-sm"
                                />
                            )}
                        />
                        {errors.focus && (
                            <p className="text-red-500 text-xs mt-1">{errors.focus.message}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm text-gray-400 dark:text-gray-500">
                            Status
                        </label>
                        <Controller
                            name="status"
                            control={control}
                            rules={{ required: "Status is required" }}
                            render={({ field }) => (
                                <CustomMultiSelectField
                                    {...field}
                                    id="status"
                                    options={statusOptions}
                                    placeholder="Select status"
                                    onChange={(selected) => field.onChange(selected?.value)}
                                    value={statusOptions.find(opt => opt.value === field.value) || null}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 text-sm"
                                />
                            )}
                        />
                        {errors.status && (
                            <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
                        )}
                    </div>
                    {/* Team Members */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm text-gray-400 dark:text-gray-500">Team Members</label>
                            <i className="ph ph-plus text-sm text-primary border border-teal-600 dark:border-teal-300 rounded p-2 cursor-pointer hover:bg-teal-600 dark:hover:bg-teal-700 hover:text-white" onClick={() => append({ name: "", role: "" })}></i>
                        </div>
                        {fields.map((member, index) => (
                            <div key={member.id} className="flex gap-2 mb-2">
                                <Controller
                                    name={`teamMembers[${index}].role`}
                                    control={control}
                                    rules={{ required: "Role is required" }}
                                    render={({ field }) => (
                                        <CustomMultiSelectField
                                            {...field}
                                            options={teamDesignation}
                                            placeholder="Role"
                                            onChange={(selected) => field.onChange(selected?.value)}
                                            value={teamDesignation.find(opt => opt.value === field.value) || null}
                                            className="w-1/2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 text-sm"
                                        />
                                    )}
                                />
                                <Controller
                                    name={`teamMembers[${index}].name`}
                                    control={control}
                                    rules={{ required: "Name is required" }}
                                    render={({ field }) => (
                                        <CustomMultiSelectField
                                            {...field}
                                            options={teamUser}
                                            placeholder="Name"
                                            onChange={(selected) => field.onChange(selected?.value)}
                                            value={teamUser.find(opt => opt.value === field.value) || null}
                                            className="w-1/2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 text-sm"
                                        />
                                    )}
                                />
                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => remove(index)}
                                        bgColor="bg-white dark:bg-gray-700"
                                        textColor="text-red-500 dark:text-red-400"
                                        className="p-2 border border-red-500 dark:border-red-400 rounded hover:bg-red-500 dark:hover:bg-red-600 hover:text-white"
                                    >
                                        <i className="ph ph-trash text-sm"></i>
                                    </Button>
                                )}
                            </div>
                        ))}
                        {errors.teamMembers && (
                            <p className="text-red-500 text-xs mt-1">Please fill out all team member fields</p>
                        )}
                    </div>

                    {/* Start Date */}
                    <div>
                        <label htmlFor="startDate" className="block text-sm text-gray-400 dark:text-gray-500">
                            Start Date
                        </label>
                        <Controller
                            name="startDate"
                            control={control}
                            rules={{ required: "Start date is required" }}
                            render={({ field }) => (
                                <Datepicker
                                    {...field}
                                    id="startDate"
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                />
                            )}
                        />
                        {errors.startDate && (
                            <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
                        )}
                    </div>

                    {/* Due Date */}
                    <div>
                        <label htmlFor="startDate" className="block text-sm text-gray-400 dark:text-gray-500">
                            Due Date
                        </label>
                        <Controller
                            name="dueDate"
                            control={control}
                            rules={{ required: "Due date is required" }}
                            render={({ field }) => (
                                <Datepicker
                                    {...field}
                                    id="dueDate"
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                />
                            )}
                        />
                        {errors.dueDate && (
                            <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            bgColor="bg-white dark:bg-gray-700"
                            textColor="text-teal-600 dark:text-teal-300"
                            className="px-4 py-2 border border-teal-600 dark:border-teal-300 rounded hover:bg-teal-600 dark:hover:bg-teal-700 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            bgColor="bg-teal-600"
                            textColor="text-white"
                            className="px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Add"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Projects;