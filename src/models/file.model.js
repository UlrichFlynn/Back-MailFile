const mongoose = require("mongoose");

const fileDetailsSchema = new mongoose.Schema({
    name: { type: String },
    numberOfDownloads: {
        type: Number,
        default: 0
    },
    path: { type :String },
    link: { type :String },
});

const fileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user"
    },
    recipient: { type: String },
    password: { type: String },
    message: { type: String },
    files: [ fileDetailsSchema ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;