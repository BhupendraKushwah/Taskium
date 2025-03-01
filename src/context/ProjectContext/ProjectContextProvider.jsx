import React, { useState } from 'react'
import ProjectContext from './ProjectContext'

const ProjectContextProvider = ({ children }) => {
    const [projects, setProject] = useState([]);
    const addProjects = (project) => {
        setProject(prev => [...prev, {
            id: Date.now()+Math.random(),
            name: project.projectName,
            description: project.description,
            startDate: new Date(project?.startDate)?.toISOString().split("T")[0],
            team: project.teamMembers
        }])
    }
    const updateProject = (id, project) => {
        setProject(prev => prev.map(item => item.id === id ? project : item))
    }

    const deleteProject = (id) => {
        setProject(prev => prev.filter(item => item.id !== id))
    }
    return (
        <ProjectContext.Provider value={{ projects, addProjects, updateProject, deleteProject }}>
            {children}
        </ProjectContext.Provider>
    )
}

export default ProjectContextProvider;