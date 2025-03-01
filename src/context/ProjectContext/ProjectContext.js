import React from "react";

export const ProjectContext = React.createContext({
    projects: [],
    addProjects: (project) => { },
    updateProject: (id, project) => { },
    deleteProject: (id) => { }
});

// export const useProject = () => React.useContext(ProjectContext);
export const useProject = () => React.useContext(ProjectContext);
export default ProjectContext;