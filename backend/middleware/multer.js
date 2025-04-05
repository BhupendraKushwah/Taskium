import multer from 'multer';

// Setup storage (you can customize destination and filename)
const storage = multer.memoryStorage(); // or diskStorage
const upload = multer({ storage });

export default upload.single('image'); // if you're uploading a single image
