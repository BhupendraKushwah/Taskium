
export const getImage = (folder,image) =>{
    try {
        let cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        return `https://res.cloudinary.com/${cloudName}/image/upload/taskium/${folder}/${image}`
    } catch (error) {
        throw error;
    }
}