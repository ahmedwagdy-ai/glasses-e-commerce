const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
    async deleteImage(publicId) {
        try {
            if (!publicId) return;
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error(`Failed to delete image ${publicId}:`, error);
            // We generally don't want to throw here to avoid stopping the main process
        }
    }
}

module.exports = new CloudinaryService();
