const bcrypt = require('bcrypt');
const { validateEmail, generateToken, generatePassword } = require('../helper/utils');
const { userService, emailService } = require('../services');


exports.login = async (req, res) => {
    try {
        if (!validateEmail(req.body.email)) {
            return res.status(400).json({
                type: "error",
                message: "Invalid email"
            });
        }
        let user = await userService.getByEmail(req.body.email);
        if (!user) {
            return res.status(404).json({
                type: "error",
                message: "No user found with this email"
            });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                type: "error",
                message: "Password does not match"
            });
        }
        const token = generateToken(user._id, user.email);
        if (!token) {
            return res.status(500).json({
                type: "error",
                message: "Error generating token"
            });
        }
        user = await userService.update(user._id, { token });
        if (user.token !== token) {
            return res.status(500).json({
                type: "error",
                message: "Token not saved"
            });
        }
        return res.status(200).json({
            type: "success",
            message: "Login successfull",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
};

exports.logout = async (req, res) => {
    req.session.destroy();
    return res.status(200).json({
        type: "success",
        message: "Logout successfull"
    });
}

exports.createAccount = async (req, res) => {
    try {
        if (!validateEmail(req.body.email)) {
            return res.status(400).json({
                type: "error",
                message: "Invalid email"
            });
        }
        if (!["ADMIN", "USER"].includes(req.body.role)) {
            return res.status(400).json({
                type: "error",
                message: "Invalid role"
            });
        }
        if ( await userService.isEmailTaken(req.body.email) ) {
            return res.status(400).json({
                type: "error",
                message: "The email you entered is already taken"
            });
        }

        const password = generatePassword();
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await userService.create({ ...req.body, password: hashPassword, email: req.body.email.toLowerCase() });
        if (user) {
            console.log("PASSWORD: ", password);
            const emailData = {
                from: req.user.email,
                to: user.email,
                subject: "Welcome on MailFile",
                code: "",
                description: `Your account has been successfully created on MailFile. Use the password below to login.<br>Password: <b>${password}</b>`
            }

            res.status(201).json({
                type: "success",
                message: "Account successfully created",
                data: user
            });

            emailService.sendCodeEmail(emailData);
        }
        else {
            return res.status(500).json({
                type: "error",
                message: "Account creation failure"
            });
        }
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}