import { useState } from "react";
import CustomSearchField from "../component/commonComponent/customFields/CustomSearchField";
import ProjectDetails from "../component/projects/ProjectData";
import Button from '../component/commonComponent/customFields/Button';
import Input from "../component/commonComponent/customFields/Input";

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
    }];
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState(projectData);
    const [isSideFormOpen, setIsSideFormOpen] = useState(false);


    // Handle search input change
    const handleAsyncChange = async (value) => {
        setSearch(value);

        const filtered = projectData.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredData(filtered);
    };


    return (
        <>
            <div className="content-head flex mb-3 mt-2 justify-between items-center bg-white p-2 rounded">
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
                        className="ml-2 px-2 py-1 hover:bg-white hover:text-primary border-primary border hover:border-primary hover:shadow-md transition duration-150"
                        handleClick={() => setIsSideFormOpen(true)}>
                        <i className="ph ph-plus"></i> Project
                    </Button>
                </div>
            </div>

            <div className="relative bg-white p-3 rounded h-screen">
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
                <SidebarForm onClose={() => setIsSideFormOpen(false)} />}

        </>
    );
};
const SidebarForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        onClose(); // Close the sidebar after submitting (if implemented)
    };

    return (
        <div className="w-full h-full fixed top-22 left-0 bg-[#0000004d]">
            <div className="w-80 fixed right-0 h-full bg-white shadow-lg p-5">
                <div className="border-b border-gray-200">
                    <div className="flex justify-end mr-2">
                        <button onClick={onClose} className="cursor-pointer">
                            <i className="ph ph-arrow-line-right"></i>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="my-3">
                        <label className="text-gray-400 text-sm">Name</label>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="text-gray-400 text-sm">Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="text-gray-400 text-sm">Message</label>
                        <Input
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Write a message..."
                        />
                    </div>

                    <div className="flex justify-between">
                        <Button
                            type="button"
                            onClick={onClose}
                            bgColor="bg-gray-300"
                            textColor="text-primary"
                            className="px-3 py-1 border rounded hover:bg-gray-300"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="px-3 py-1 text-white rounded"
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
