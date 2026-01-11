const asyncHandler = require('../middleware/asyncHandler');
const userService = require('../services/userService');

// @desc    Auth user & get token
// @route   POST /api/users/login
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    res.json({
        success: true,
        message: 'User logged in successfully',
        data: user
    });
});

// @desc    Register a new user
// @route   POST /api/users
const registerUser = asyncHandler(async (req, res) => {
    const user = await userService.registerUser(req.body);
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
    });
});

// @desc    Get user profile
// @route   GET /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await userService.getUserProfile(req.user._id);
    res.json({
        success: true,
        message: 'User profile retrieved successfully',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        }
    });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await userService.updateUserProfile(req.user._id, req.body);
    res.json({
        success: true,
        message: 'User profile updated successfully',
        data: user
    });
});

// @desc    Delete user profile
// @route   DELETE /api/users/profile
const deleteUserProfile = asyncHandler(async (req, res) => {
    const result = await userService.deleteUserProfile(req.user._id);
    res.json({
        success: true,
        message: 'User profile deleted successfully',
        data: result
    });
});

// @desc    Get all users
// @route   GET /api/users
const getUsers = asyncHandler(async (req, res) => {
    const users = await userService.getUsers();
    res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: users
    });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
    const result = await userService.deleteUser(req.params.id);
    res.json({
        success: true,
        message: 'User deleted successfully',
        data: result
    });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res.json({
        success: true,
        message: 'User retrieved successfully',
        data: user
    });
});

// @desc    Update user
// @route   PUT /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({
        success: true,
        message: 'User updated successfully',
        data: user
    });
});

module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
};
