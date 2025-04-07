import React, { useState } from 'react'
import ProjectContext from './ProjectContext'

const ProjectContextProvider = ({ children }) => {
    const [projects, setProject] = useState([]);
    const addProjects = (project) => {
        setProject(prev => [...prev, {
            _id: Date.now()+Math.random(),
            name: project.projectName,
            description: project.description,
            startDate: new Date(project?.startDate)?.toLocaleDateString('en-CA').split("T")[0],
            team: project.teamMembers
        }])
    }
    const updateProject = (_id, project) => {
        setProject(prev => prev.map(item => item._id === _id ? project : item))
    }

    const deleteProject = (_id) => {
        setProject(prev => prev.filter(item => item._id !== _id))
    }
    return (
        <ProjectContext.Provider value={{ projects, addProjects, updateProject, deleteProject }}>
            {children}
        </ProjectContext.Provider>
    )
}

export default ProjectContextProvider;