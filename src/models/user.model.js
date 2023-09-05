const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    name: { type: String },
    numberOfDownloads: {
        type: Number,
        default: 0
    },
    path: { type :String },
    link: { type :String },
    recipient: { type: String },
    message: { type: String },
    password: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [ "ADMIN", "USER" ]
    },
    token: { type: String },
    files: [ fileSchema ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;