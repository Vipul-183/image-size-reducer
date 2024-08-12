const  { addImageHelper, uploadCSVHelper, getImagesHelper } = require('../helper/imageHelper');

async function addImage(req, res) {
  try {
    const { productName, imageUrls } = req.body;
    await addImageHelper({ productName, imageUrls });
    return res.status(200).send('Process initiated');
  } catch (error) {
    console.error('Error processing image from URL:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function uploadCSV(req, res) {
  try{
    const { file } = req;
    await uploadCSVHelper({ file });
    return res.status(200).json({ message: 'CSV file processed successfully' });
  } catch (error) {
    console.error('Error processing CSV file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getImages(req, res) {
  try{
    const { productName } = req.params;
    const { imageList } = await getImagesHelper({ productName });
    return res.status(200).json({ images: imageList });
  } catch (error) {
    console.error('Error getting images', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getJobStatus(req, res) {
  try {
    const { jobId } = req.params;
    const job = await imageQueue.getJob(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    const state = await job.getState();
    res.status(200).json({ jobId, state });
  } catch (error) {
    console.error('Error getting job status', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = { 
  addImage, 
  uploadCSV, 
  getImages, 
  getJobStatus 
};