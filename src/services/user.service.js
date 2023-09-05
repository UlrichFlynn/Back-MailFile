const User = require('../models/user.model');

exports.isEmailTaken = async (email) => {
    const user = await User.findOne({ email });
    return !!user;
};

exports.create = async(body) => {
    return await User.create(body);
}

exports.getByEmail = async(email) => {
    return await User.findOne({ email });
}

exports.getById = async(id) => {
    return await User.findById(id);
}

exports.update = async(id, data) => {
    return await User.findByIdAndUpdate(id, data, {new: true})
    .select('-password');
}