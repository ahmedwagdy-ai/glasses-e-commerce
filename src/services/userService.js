const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cloudinaryService = require('../services/cloudinaryService');
const QueryHelper = require('../utils/QueryHelper');

class UserService {
    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '30d',
        });
    }

    async registerUser(data) {
        const { name, email, phone, password, avatar } = data;

        const userExists = await User.findOne({ email });

        if (userExists) {
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            phone,
            password,
            avatar,
        });

        if (user) {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                isAdmin: user.isAdmin,
                token: this.generateToken(user._id),
            };
        } else {
            throw new Error('Invalid user data');
        }
    }

    async loginUser(email, password) {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                isAdmin: user.isAdmin,
                token: this.generateToken(user._id),
            };
        } else {
            throw new Error('Invalid email or password');
        }
    }

    async getUserProfile(id) {
        const user = await User.findById(id).select('-password');
        if (user) {
            return user;
        } else {
            throw new Error('User not found');
        }
    }

    // Usually updating profile is done via a separate method, but if we need it here:
    async updateUserProfile(id, data) {
        const user = await this.getUserProfile(id);

        if (data.avatar && user.avatar && user.avatar.public_id) {
            if (data.avatar.public_id !== user.avatar.public_id) {
                await cloudinaryService.deleteImage(user.avatar.public_id);
            }
        }

        user.name = data.name || user.name;
        user.email = data.email || user.email;
        user.phone = data.phone || user.phone;
        if (data.password) {
            user.password = data.password;
        }
        user.avatar = data.avatar || user.avatar;

        const updatedUser = await user.save();

        return {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            avatar: updatedUser.avatar,
            isAdmin: updatedUser.isAdmin,
            token: this.generateToken(updatedUser._id),
        };
    }
    async deleteUserProfile(id) {
        const user = await this.getUserProfile(id);

        if (user.avatar && user.avatar.public_id) {
            await cloudinaryService.deleteImage(user.avatar.public_id);
        }

        await user.deleteOne();
        return { message: 'User removed' };
    }

    // Admin methods
    async getUsers(queryString) {
        const countQuery = new QueryHelper(User.find(), queryString)
            .search(['name', 'email'])
            .filter();
        const count = await countQuery.query.countDocuments();

        const features = new QueryHelper(User.find(), queryString)
            .search(['name', 'email'])
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const users = await features.query;

        const page = queryString ? (queryString.page * 1 || 1) : 1;
        const limit = queryString ? (queryString.limit * 1 || 10) : 10;
        const pages = Math.ceil(count / limit);

        return { users, page, pages, count };
    }

    async getUserById(id) {
        const user = await User.findById(id).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async deleteUser(id) {
        const user = await User.findById(id);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.avatar && user.avatar.public_id) {
            await cloudinaryService.deleteImage(user.avatar.public_id);
        }

        await user.deleteOne();
        return { message: 'User removed' };
    }

    async updateUser(id, data) {
        const user = await User.findById(id);

        if (!user) {
            throw new Error('User not found');
        }

        user.name = data.name || user.name;
        user.email = data.email || user.email;
        user.isAdmin = data.isAdmin !== undefined ? data.isAdmin : user.isAdmin;

        return await user.save();
    }
}

module.exports = new UserService();
