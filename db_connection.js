const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { userService } = require("./src/services");

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    try {
        mongoose.connect(process.env.DATABASE, connectionParams)
        .then(async () => {
            console.log("Database connected successfully!");
            let email = process.env.ADMIN_EMAIL;
            let password = process.env.ADMIN_PASSWORD;
            let exist = await userService.getByEmail(email);
            if (exist) {
                console.log("Default admin already exist");
            }
            else {
                const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
                password = await bcrypt.hash(password, salt);
                
                let data = {
                    email,
                    password,
                    role: "ADMIN"
                }
                let admin = await userService.create(data);
                if (!admin) {
                    console.log("Error creating default admin");
                }
                else {
                    console.log("Default admin created succesfully");
                }
            }
        });
    } catch (error) {
        console.log("Could not connect to the database!");
        console.log(error);
    }
}