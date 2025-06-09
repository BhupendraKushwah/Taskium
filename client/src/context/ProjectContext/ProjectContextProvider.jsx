import React, { useEffect, useState } from 'react'
import ProjectContext from './ProjectContext'
import useApi from '../../hooks/instance';
import toast from 'react-hot-toast';

const ProjectContextProvider = ({ children }) => {
    const limit = 10;
    const api = useApi();
    const [projects, setProject] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);

    const saveSettings = async (response, callback) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (response.success) {
                    if (typeof callback === 'function') {
                        callback();  // Only run if it's a function
                    }
                    resolve(response.message || 'Project created!');
                } else {
                    reject('Could not create.');
                }
            }, 1000);
        });
    };

    const addProjects = async (project) => {
        try {
            let response = await api.post('/projects/add-project', project, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.promise(
                saveSettings(response, async () => {
                    setProject([]); // Reset tasks to trigger a fresh fetch
                    setOffset(0);
                    setHasMore(true);
                    await getProjects({},0); // Fetch from the beginning
                }),
                {
                    loading: 'Saving...',
                    success: <b>Project created!</b>,
                    error: <b>Could not create.</b>,
                }
            );
        } catch (error) {
            console.log('error', error)
        }
    }
    const updateProject = (id, project) => {
        try {
            let response = api.put(`/projects/update-project/${id}`, project);
            setProject(prev => prev.map(item => item.id === id ? project : item))
        } catch (error) {

        }
    }

    const deleteProject = async (id) => {
        try {
            let response = await api.delete(`/projects/delete-project/${id}`);
            toast.promise(
                saveSettings(response, () =>
                    setProject(prev => prev.filter(item => item.id !== id))),
                {
                    loading: 'Deleting...',
                    success: <b>{response.message}</b>,
                    error: <b>Could not delete project.</b>,
                }
            );
        } catch (error) {

        }
    }
    const getProjects = async (filters = {}, Offset) => {
        try {
            const response = await api.get('/projects/get-projects', {
                ...filters,
                limit,
                offset: Offset ?? offset
            });
            const newData = response.data || [];
            setProject(prev => [...prev, ...newData]);
            setOffset(prev => prev + limit);
            if (newData.length < limit) {
                setHasMore(false);
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getProjects();
    }, [])
    return (
        <ProjectContext.Provider value={{ projects, setProject, addProjects, updateProject, deleteProject, getProjects, hasMore, setOffset }}>
            {children}
        </ProjectContext.Provider>
    )
}

export default ProjectContextProvider;