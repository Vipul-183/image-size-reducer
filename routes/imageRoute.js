const imageRoute = require('express')();

const multer = require('multer');
const { addImage, uploadCSV, getImages, getJobStatus } = require('../controller/imageController');
const { validateAddImageParams, validateUploadCSVPayload, validateJobStatusParam, validateImagesByProductParams } = require('../middleWare/imageValidator');
const uploadFile = multer({ dest: "/tmp/uploads/" });


imageRoute.post('/add-image', validateAddImageParams, addImage);
imageRoute.post('/upload-csv', uploadFile.single('file'), validateUploadCSVPayload, uploadCSV)
imageRoute.get('/job-status/:jobId', validateJobStatusParam, getJobStatus);
imageRoute.get('/images/:productName', validateImagesByProductParams, getImages);

module.exports = imageRoute;
