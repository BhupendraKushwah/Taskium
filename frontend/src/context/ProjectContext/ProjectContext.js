import React from "react";

const ProjectContext = React.createContext({
    projects: [],
    addProjects: (project) => { },
    updateProject: (id, project) => { },
    deleteProject: (id) => { },
    getProjects:()=>{ }
});

export const useProject = () => React.useContext(ProjectContext);
export default ProjectContext;