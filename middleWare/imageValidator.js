
const { imageQueue } = require('../queue/image');

async function validateAddImageParams(req, res, next) {
    try {
        const { productName, imageUrls } = req.body;
        if (!productName || !imageUrls || !Array.isArray(imageUrls)) {
            throw {status: 400, message: 'Invalid request data'};
        }
        console.log('Image pushed in queue successfully');
        next();
    } catch (err) {
        const { status = 500, message = 'Internal Server Error'} = err;
        return res.status(status).json({ error: message });
    }
}

async function validateUploadCSVPayload(req, res, next) {
    try {
        if (!req.file) {
            throw {status: 400, message: 'No file uploaded'};
        }
        next();
    } catch (err) {
        const { status = 500, message = 'Internal Server Error'} = err;
        return res.status(status).json({ error: message });
    }
}

async function validateJobStatusParam(req, res, next) {
    try {
        const { jobId } = req.params;
        if (!process.env.DEVELOPMENT) {
            throw {status: 400, message: 'only work on development'};
        }
        const job = await imageQueue.getJob(jobId);
        if (!job) {
            throw {status: 404, message: 'Job not found'};
        }
        next();
    } catch (err) {
        const { status = 500, message = 'Internal Server Error'} = err;
        return res.status(status).json({ error: message });
    }
}

async function validateImagesByProductParams(req, res, next) {
    try {
        const { productName } = req.params;
        if (!productName) {
            throw {status: 400, message: 'Invalid request data'};
        }
        next();
    } catch (err) {
        const { status = 500, message = 'Internal Server Error'} = err;
        return res.status(status).json({ error: message });
    }
}

module.exports = {
    validateAddImageParams,
    validateUploadCSVPayload,
    validateJobStatusParam,
    validateImagesByProductParams
};