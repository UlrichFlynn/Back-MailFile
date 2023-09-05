const util = require('util');
const multer = require('multer');
const path = require('path');

const avatarStorage = multer.diskStorage({
  destination: 'public/uploads/avatar',
  filename: (req, file, cb) => {
    let fileName = file.originalname;
    const i = fileName.lastIndexOf('.');
    fileName = fileName.slice(0, i);
    const end = file.originalname.slice(i);
    fileName = fileName + '-' + Date.now() + end;

    cb(null, fileName);
  },
});

const fileStorage = multer.diskStorage({
  destination: 'public/uploads/files',
  filename: (req, file, cb) => {
    let fileName = file.originalname;
    const i = fileName.lastIndexOf('.');
    fileName = fileName.slice(0, i);
    const end = file.originalname.slice(i);
    fileName = fileName + '-' + Date.now() + end;

    cb(null, fileName);
  },
});

const checkFilterType = ({ file, cb, fileTypes }) => {
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  } else {
    cb("Error: Please use only images.");
  }
};

const checkFilterType1 = ({ file, cb, fileTypes }) => {
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb('Error: Sorry you cannot upload this file.');
  }
};

const uploadImage = multer({
  storage: avatarStorage,
  fileFilter: (req, file, cb) => {
    checkFilterType({ cb, file, fileTypes: /png|jpeg|jpg/ });
  },
});

const uploadFile = multer({
  storage: fileStorage,
  fileFilter: (req, file, cb) => {
    checkFilterType1({ cb, file, fileTypes: /png|jpeg|jpg|pdf|csv|docx/ });
  },
});


const uploadSingleImage = (fieldName) => util.promisify(uploadImage.single(fieldName));

const uploadSingleFile = (fieldName) => util.promisify(uploadFile.single(fieldName));

const uploadMultipleFiles = (fieldName) => util.promisify(uploadFile.array(fieldName));

module.exports = { uploadSingleImage, uploadSingleFile, uploadMultipleFiles };
