import { useEffect, useState } from "react";
import CustomSearchField from "../component/commonComponent/customFields/CustomSearchField";
import ProjectDetails from "../component/projects/ProjectData";
import Button from '../component/commonComponent/customFields/Button';
import Input from "../component/commonComponent/customFields/Input";
import Datepicker from "../component/commonComponent/customFields/Datepicker";
import CustomMultiselect from "../component/commonComponent/customFields/CustomMultiSelectField";
import dayjs from "dayjs";
import { useProject } from "../context/ProjectContext";

const Projects = () => {
    const { projects, addProjects, updateProject, deleteProject } = useProject();
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
        setFilteredProjects(projects)
    }, [projects])

    return (
        <div className="overflow-hidden">
            <div className="content-head flex flex-col sm:flex-row sm:items-center mb-3 mt-2 justify-between bg-white p-2 rounded">
                <h3 className="text-lg">Projects</h3>
                <div className="content-head-right flex items-center">
                    <CustomSearchField onChange={handleAsyncChange} value={search} placeholder="Search here" />
                    <Button className="ml-2" handleClick={() => setIsSideFormOpen(true)}>
                        <i className="ph ph-plus"></i><span className="sm:inline hidden">Project</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-5 bg-white p-3 rounded">
                {filteredProjects?.length ? filteredProjects.map(project => (
                    <ProjectDetails key={project.id} project={project} />
                )) : <div className="page w-screen">
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-2xl text-gray-400">No projects found</p>
                    </div>
                </div>
                }
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
        e.preventDefault(); // Add this
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
    );
};

export default Projects;
