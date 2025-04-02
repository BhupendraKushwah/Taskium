import cloudinary from '../config/cloudinary.js'
import logger from '../config/logger.js';

export const uploadImage = async (file, folderName) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: 'auto',
            folder: `taskium/${folderName}`
        })
        console.log(result)
    }
    catch (error) {
        logger.Error(error,{'filepath':'/utils/upload.js', 'function':'uploadImage'})
        console.log(error)
    }
}


export const deleteImage = async (publicId) => {
    try {
        cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error)
    }
}