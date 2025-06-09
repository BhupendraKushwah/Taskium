const cloudinary = require('../config/cloudinary');
const sharp = require('sharp');

const uploadImage = async (buffer, options) => {
    try {
        const compressedBuffer = await sharp(buffer)
        .resize(800) // Optional: Resize to width 800px (preserves aspect ratio)
        .jpeg({ quality: 70 }) // Compress to 70% quality JPEG
        .toBuffer(); 

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
              if (result) resolve(result);
              else reject(error);
            });
            stream.end(compressedBuffer);
          });   
    } catch (error) {
        console.log(error)
    }
}


 const deleteImage = async (publicId) => {
    try {
        cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    uploadImage,
    deleteImage
}