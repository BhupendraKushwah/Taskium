
const CONSTANTS = {
    RESPONSE_MESSAGES: {
        UPLOAD_SUCCESS: 'Image uploaded successfully',
        UPLOAD_FAILED: 'Image upload failed',
        DELETE_SUCCESS: 'Image deleted successfully',
        DELETE_FAILED: 'Image deletion failed',
        INVALID_REQUEST: 'Invalid request parameters',
        SERVER_ERROR: 'Internal Server Error',
    },

    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500,
    },

    FILE_LIMITS: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'gif'],
    },
    PAGINATION: {
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100,
    },

};

module.exports = CONSTANTS;
