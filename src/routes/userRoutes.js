const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { registerUserSchema, loginUserSchema, updateUserProfileSchema } = require('../validations/userValidation');
const upload = require('../config/cloudinary');
const { parseFile } = require('../middleware/fileParser');

router
    .route('/')
    .post(upload.single('avatar'), parseFile('avatar'), validate(registerUserSchema), registerUser);

router.post('/login', validate(loginUserSchema), authUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, upload.single('avatar'), parseFile('avatar'), validate(updateUserProfileSchema), updateUserProfile)
    .delete(protect, deleteUserProfile);

module.exports = router;
