const jwt = require("jsonwebtoken");

exports.generateToken = (_id, email) => {
    try {
        const token = jwt.sign(
            { _id, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRE_IN }
        );
        return token;
    } catch (error) {
        return null;
    }
}

exports.validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

exports.generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

exports.generatePassword = () => {
    let result = "";
    const length = 8;
    const characters = "0123456789abcdefghijklmnopqrstuvwxyz*.!@#$%^&<_>,.~-ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}