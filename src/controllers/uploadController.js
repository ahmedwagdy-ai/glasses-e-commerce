const asyncHandler = require('../middleware/asyncHandler');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No image file provided');
    }

    res.send({
        message: 'Image uploaded successfully',
        url: req.file.path,
        public_id: req.file.filename,
    });
});

module.exports = {
    uploadImage,
};
