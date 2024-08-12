const axios = require('axios');
const sharp = require('sharp');
const Image = require('../models/image');

const addImageHelper = async ({ productName, imageUrls }) => {
    for (const url of imageUrls) {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const originalImageBuffer = Buffer.from(response.data, 'binary');

        const compressedImageBuffer = await sharp(originalImageBuffer)
            .resize(500, 500)
            .jpeg({ quality: 50 })
            .toBuffer();

        const image = new Image({
            productName: productName.toLowerCase(),
            url,
            image: compressedImageBuffer,
            reducedPercent: ((originalImageBuffer.byteLength - compressedImageBuffer.byteLength) / originalImageBuffer.byteLength) * 100,
        });
        await image.save();
        console.log("image saved ", productName);
    }
};

const uploadCSVHelper = async ({ file }) => {
    const csvFilePath = file.path;
    const results = [];
    fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
        console.log(results)
        for (const row of results) {
            const data = Object.values(row);
            addImageHelper({productName: data[1], imageUrls: data[2].split(',')});
        }
        fs.unlinkSync(csvFilePath);
    });
}

const getImagesHelper = async ({ productName }) => {
    const images = await Image.find({ productName: productName.toLowerCase() });
    if (!images || images.length === 0) {
        throw { status: 404, message: 'No images found for this product' };
    }
    const imageList = images.map(image => ({
        productName: image.productName,
        url: image.url,
        reducedPercent: image.reducedPercent,
    }));
    return { imageList };
};

module.exports = {
    addImageHelper, 
    uploadCSVHelper,
    getImagesHelper
};