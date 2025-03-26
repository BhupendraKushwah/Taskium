import { useEffect, useState } from "react";
import { CustomSearchField, Button, Input, Datepicker, CustomMultiSelectField } from "../component/commonComponent/customFields/";
import ProjectDetails from "../component/projects/ProjectData";
import dayjs from "dayjs";
import { useProject } from "../context/ProjectContext/ProjectContext";

const Projects = () => {
    const { projects, addProjects } = useProject();
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [isSideFormOpen, setIsSideFormOpen] = useState(false);
    const projectData = Array(7).fill(null).map((_, index) => ({
        projectName: "Portfolio",
        description: "A project to redesign the company's website with a modern look.",
        status: "In Progress",
        teamMembers: [
            { name: "John Doe", role: "Designer" },
            { name: "Jane Smith", role: "Developer" }
        ],
        tasks: [
            { name: "Create wireframes", completed: true },
            { name: "Develop homepage", completed: false },
            { name: "Test responsiveness", completed: false }
        ],
        startDate: "2025-01-01",
        dueDate: "2025-02-01"
    }));

    const handleAsyncChange = async (value) => {
        setSearch(value);
        setFilteredProjects(
            projects.filter(item =>
                item.name.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    const handleSubmit = async (value) => {
        addProjects(value);
        setIsSideFormOpen(false);
    };

    useEffect(() => {
        projectData.forEach((item) => addProjects(item));
    }, []);

    useEffect(() => {
        setFilteredProjects(projects);
    }, [projects]);

    return (
        <div className="overflow-hidden dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
            <div className="content-head flex flex-col sm:flex-row sm:items-center mb-3 mt-2 justify-between bg-white dark:bg-gray-800 p-2 rounded dark:border-gray-700">
                <h3 className="text-lg text-gray-900 dark:text-white">Projects</h3>
                <div className="content-head-right flex items-center">
                    <CustomSearchField
                        onChange={handleAsyncChange}
                        value={search}
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

            <div className={`overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 p-3 rounded ${filteredProjects.length <= 3 ? "h-[calc(100vh-100px)]" : "h-full"}`}>
                {filteredProjects?.length ? (
                    filteredProjects.map(project => (
                        <div key={project._id}>
                            <ProjectDetails project={project} />
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center min-h-full w-full col-span-full">
                        <p className="text-2xl text-center text-gray-400 dark:text-gray-500">No projects found</p>
                    </div>
                )}
            </div>

            {isSideFormOpen && <ProjectForm onClose={() => setIsSideFormOpen(false)} onSubmit={handleSubmit} />}
        </div>
    );
};

const ProjectForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        projectName: "",
        description: "",
        startDate: new Date(),
        teamMembers: [{ name: "", role: "" }],
        message: ""
    });

    const teamDesignation = ["Designer", "Developer", "Tester"].map(role => ({ label: role, value: role }));

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleDateChange = (date) => setFormData(prev => ({ ...prev, startDate: date }));

    const handleTeamChange = (index, field, value) => {
        const updatedTeam = [...formData.teamMembers];
        updatedTeam[index][field] = value;
        setFormData(prev => ({ ...prev, teamMembers: updatedTeam }));
    };

    const addTeamMember = (e) => {
        e.preventDefault();
        setFormData((prev) => ({
            ...prev,
            teamMembers: [...prev.teamMembers, { name: "", role: "" }],
        }));
    };

    const removeTeamMember = (index) => {
        setFormData(prev => ({ ...prev, teamMembers: prev.teamMembers.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="w-full h-full fixed top-18 left-0 bg-[#0000004d] dark:bg-[#00000080] flex justify-end z-50">
            <div className="w-3/4 sm:w-1/2 md:w-1/2 lg:w-1/3 h-[calc(100vh-72px)] bg-white dark:bg-gray-800 shadow-lg p-5 overflow-y-auto dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2 flex justify-end">
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-gray-600 dark:text-gray-700 hover:text-black dark:hover:text-white"
                    >
                        <i className="ph ph-arrow-line-right text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Project Name */}
                    <div>
                        <label className="text-gray-400 dark:text-gray-500 text-sm">Project Name</label>
                        <Input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-200 dark:placeholder-gray-500"
                            placeholder="Enter project name"
                        />
                    </div>

                    {/* Project Description */}
                    <div>
                        <label className="text-gray-400 dark:text-gray-500 text-sm">Project Description</label>
                        <Input
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-200 dark:placeholder-gray-500"
                            placeholder="Describe the project..."
                        />
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="text-gray-400 dark:text-gray-500 text-sm">Start Date</label>
                        <Datepicker
                            defaultValue={dayjs(formData.startDate)}
                            onChange={handleDateChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                        />
                    </div>

                    {/* Team Members */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-gray-400 dark:text-gray-500 text-sm">Team Members</label>
                            <Button
                                type="button"
                                onClick={addTeamMember}
                                bgColor="bg-white dark:bg-gray-700"
                                textColor="text-teal-600 dark:text-teal-300"
                                className="mt-2 border-1 border-teal-600 dark:border-teal-300 rounded px-1 cursor-pointer hover:bg-teal-600 dark:hover:bg-teal-700 hover:text-white dark:hover:text-white transition duration-300"
                            >
                                <i className="ph ph-plus text-sm"></i>
                            </Button>
                        </div>
                        {formData.teamMembers.map((member, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <CustomMultiSelectField
                                    options={teamDesignation}
                                    placeholder="Role"
                                    onChange={(e) => handleTeamChange(index, "role", e.value)}
                                    className="w-1/2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-200 dark:placeholder-gray-500"
                                />
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    value={member.name}
                                    onChange={(e) => handleTeamChange(index, "name", e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-200 dark:placeholder-gray-500"
                                />
                                {formData.teamMembers.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeTeamMember(index)}
                                        bgColor="bg-white dark:bg-gray-700"
                                        textColor="text-red-500 dark:text-red-400"
                                        className="p-1 rounded border-1 border-red-500 dark:border-red-400 cursor-pointer hover:bg-red-500 dark:hover:bg-red-600 hover:text-white dark:hover:text-white transition duration-300"
                                    >
                                        <i className="ph ph-trash text-sm"></i>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Message */}
                    <div>
                        <label className="text-gray-400 dark:text-gray-500 text-sm">Message</label>
                        <Input
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-200 dark:placeholder-gray-500"
                            placeholder="Write a message..."
                        />
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
                            bgColor="bg-teal-600"
                            textColor="text-white"
                            className="px-5 py-1 rounded hover:bg-teal-700 dark:hover:bg-teal-800 transition duration-300"
                        >
                            Add
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Projects;