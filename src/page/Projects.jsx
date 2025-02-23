import { useState } from "react";
import CustomSearchField from "../component/commonComponent/customFields/CustomSearchField";
import ProjectDetails from "../component/projects/ProjectData";
import Button from '../component/commonComponent/customFields/Button';
import Input from "../component/commonComponent/customFields/Input";
import Datepicker from "../component/commonComponent/customFields/Datepicker";
import CustomMultiselect from "../component/commonComponent/customFields/CustomMultiSelectField";
import dayjs from "dayjs";

const Projects = () => {
    // Dummy data to search from
    const projectData = [{
        id: 1,
        name: "Portfolio",
        description: "A project to redesign the company's website with a modern look.",
        status: "In Progress",
        team: [
            { name: "John Doe", role: "Designer" },
            { name: "Jane Smith", role: "Developer" },
        ],
        tasks: [
            { name: "Create wireframes", completed: true },
            { name: "Develop homepage", completed: false },
            { name: "Test responsiveness", completed: false },
        ],
        startDate: "2025-01-01",
        dueDate: "2025-02-01",
    }, {
        id: 1,
        name: "Portfolio",
        description: "A project to redesign the company's website with a modern look.",
        status: "In Progress",
        team: [
            { name: "John Doe", role: "Designer" },
            { name: "Jane Smith", role: "Developer" },
        ],
        tasks: [
            { name: "Create wireframes", completed: true },
            { name: "Develop homepage", completed: false },
            { name: "Test responsiveness", completed: false },
        ],
        startDate: "2025-01-01",
        dueDate: "2025-02-01",
    }, {
        id: 1,
        name: "Portfolio",
        description: "A project to redesign the company's website with a modern look.",
        status: "In Progress",
        team: [
            { name: "John Doe", role: "Designer" },
            { name: "Jane Smith", role: "Developer" },
        ],
        tasks: [
            { name: "Create wireframes", completed: true },
            { name: "Develop homepage", completed: false },
            { name: "Test responsiveness", completed: false },
        ],
        startDate: "2025-01-01",
        dueDate: "2025-02-01",
    }, {
        id: 1,
        name: "Portfolio",
        description: "A project to redesign the company's website with a modern look.",
        status: "In Progress",
        team: [
            { name: "John Doe", role: "Designer" },
            { name: "Jane Smith", role: "Developer" },
        ],
        tasks: [
            { name: "Create wireframes", completed: true },
            { name: "Develop homepage", completed: false },
            { name: "Test responsiveness", completed: false },
        ],
        startDate: "2025-01-01",
        dueDate: "2025-02-01",
    }, {
        id: 1,
        name: "Portfolio",
        description: "A project to redesign the company's website with a modern look.",
        status: "In Progress",
        team: [
            { name: "John Doe", role: "Designer" },
            { name: "Jane Smith", role: "Developer" },
        ],
        tasks: [
            { name: "Create wireframes", completed: true },
            { name: "Develop homepage", completed: false },
            { name: "Test responsiveness", completed: false },
        ],
        startDate: "2025-01-01",
        dueDate: "2025-02-01",
    }, {
        id: 1,
        name: "Portfolio",
        description: "A project to redesign the company's website with a modern look.",
        status: "In Progress",
        team: [
            { name: "John Doe", role: "Designer" },
            { name: "Jane Smith", role: "Developer" },
        ],
        tasks: [
            { name: "Create wireframes", completed: true },
            { name: "Develop homepage", completed: false },
            { name: "Test responsiveness", completed: false },
        ],
        startDate: "2025-01-01",
        dueDate: "2025-02-01",
    }, {
        id: 1,
        name: "Portfolio",
        description: "A project to redesign the company's website with a modern look.",
        status: "In Progress",
        team: [
            { name: "John Doe", role: "Designer" },
            { name: "Jane Smith", role: "Developer" },
        ],
        tasks: [
            { name: "Create wireframes", completed: true },
            { name: "Develop homepage", completed: false },
            { name: "Test responsiveness", completed: false },
        ],
        startDate: "2025-01-01",
        dueDate: "2025-02-01",
    },];
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState(projectData);
    const [isSideFormOpen, setIsSideFormOpen] = useState(false);


    // Handle search Input change
    const handleAsyncChange = async (value) => {
        setSearch(value);

        const filtered = projectData.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredData(filtered);
    };
    const handleSubmit = async (value) => {
        console.log(value);
    }


    return (
        <div className="overflow-hidden">
            <div className="content-head flex flex-col sm:flex-row sm:items-center items-start mb-3 mt-2 justify-between bg-white p-2 rounded">
                <div className="content-head-left flex">
                    <h3 className="text-lg">Projects</h3>
                </div>
                <div className="content-head-right flex items-center">
                    <CustomSearchField
                        onChange={handleAsyncChange}
                        value={search}
                        type="text"
                        placeholder="Search here"
                    />
                    <Button
                        className="ml-2 px-3 sm:px-4 h-10 flex items-center gap-2 hover:bg-white hover:text-primary border-primary border hover:border-primary hover:shadow-md transition duration-150 rounded-md"
                        handleClick={() => setIsSideFormOpen(true)}
                    >
                        <i className="ph ph-plus"></i>
                        <span className="sm:inline hidden">Project</span>
                    </Button>
                </div>
            </div>

            <div className="relative bg-white p-3 rounded grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-5 page overflow-auto">
                {filteredData.length ? (
                    filteredData.map(project => (
                        <ProjectDetails key={project.id} project={project} />
                    ))
                ) :
                    <div className="w-full h-full">
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-2xl text-gray-400">No projects found</p>
                        </div>
                    </div>
                }
            </div>
            {isSideFormOpen &&
                <ProjectForm onClose={() => setIsSideFormOpen(false)} onSubmit={handleSubmit} />}

        </div>
    );
};
const ProjectForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        projectName: "",
        description: "",
        startDate: new Date(),
        teamMembers: [{ name: "", role: "" }],
        message: "",
    });

    const teamDesignation = [
        { label: "Designer", value: "Designer" },
        { label: "Developer", value: "Developer" },
        { label: "Tester", value: "Tester" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({ ...prev, startDate: date }));
    };

    const handleTeamChange = (index, field, value) => {
        const updatedTeam = [...formData.teamMembers];
        updatedTeam[index][field] = value;
        setFormData((prev) => ({ ...prev, teamMembers: updatedTeam }));
    };

    const addTeamMember = () => {
        setFormData((prev) => ({
            ...prev,
            teamMembers: [...prev.teamMembers, { name: "", role: "" }],
        }));
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
                                onClick={addTeamMember}
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
