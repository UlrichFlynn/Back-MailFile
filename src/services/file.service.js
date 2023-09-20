const { File } = require('../models');

exports.create = async(body) => {
    return await File.create(body);
}

exports.update = async (id, data) => {
    return await File.findByIdAndUpdate(id, data, { new: true });
}

exports.getById = async(id) => {
    return await File.findById(id);
}

exports.getAll = async() => {
    return await File.find()
    .populate("userId")
    .sort("-createdAt");
}