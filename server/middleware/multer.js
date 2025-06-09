const multer = require('multer');

// Setup storage (memory storage used here)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload.single('image');
